import React from 'react';
import * as firebase from 'firebase';
import {Dialog, DialogButton, DialogContent, DialogFooter, DialogTitle} from 'react-native-popup-dialog';
import {Linking, Text} from 'react-native';
import Logger from './Logger';

export class VersionController extends React.Component {

    versionCode = '6.1.20';
    dialog_disabled = true;

    constructor(props) {

        super(props);

        this.state = {
            showDialog: false,
            canBeIgnored: true,
            updateInfo: '5',
        };

        if (this.dialog_disabled) {
            return;
        }
        
        firebase.database().ref('accounts/' + global.user.name + '/version').set(this.versionCode, function(error) {
            
            //console.log('callback called');
            if (error) {
            //    console.log('error');
            } else {
             //   console.log("success");
            }
        });

        firebase.database().ref('meta').on('value', (snapshot) => {

            let data = snapshot.val();

            if (!data || !data.actualVersion) {
                Logger.log('Не найдена актуальная версия на сервере Firebase');
                return;
            }

            let actualVersion = data.actualVersion.split('.').map(i => {
                return Number.parseInt(i);
            });

            let currentVersion = this.versionCode.split('.').map(i => {
                return Number.parseInt(i);
            });

            let major = actualVersion[0] > currentVersion[0];
            let minor = actualVersion[1] > currentVersion[1];
            let patch = actualVersion[2] > currentVersion[2];

            if (major) {
                this.setState({canBeIgnored: false, showDialog: true, updateInfo: data.majorText});
            } else if (minor && !major) {
                this.setState({canBeIgnored: false, showDialog: true, updateInfo: data.minorText});
            } else if (patch && !minor && !major) {
                this.setState({canBeIgnored: true, showDialog: true, updateInfo: data.patchText});
            }
        });
    }

    openLink() {
        Linking.openURL('market://details?id=ru.pivko24.mobid');
        this.dismiss();
    }

    dismiss() {
        this.setState({showDialog: false});
    }

    render() {
        return (
            <Dialog
                visible={this.state.showDialog}
                dismissOnTouchOutside={true}
                width={1}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Не обновлять"
                            onPress={() => this.dismiss()}
                        />

                        <DialogButton
                            text="Обновить"
                            onPress={() => this.openLink()}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title="Доступна новая версия"
                />
                <DialogContent>
                    <Text>{this.state.updateInfo}</Text>
                </DialogContent>
            </Dialog>
        );
    }


}
