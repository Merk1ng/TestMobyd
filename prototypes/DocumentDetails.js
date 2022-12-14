import React from 'react';
import {StyleSheet, Alert, Text, ScrollView, BackHandler, View} from 'react-native';
import AppHeader from '../components/AppHeader';
import CommonFunctions from '../helpers/CommonFunctions';
import MobidServer1C from '../helpers/MobidServer1C';
import {DialogProcess} from '../components/DialogProcess';
import {DialogSave} from '../components/DialogSave';
import * as firebase from 'firebase';

export class DocumentDetails extends React.Component {

    TITLE;
    LIST_SCREEN;
    DESTINATION;
    PREFIX_ID = 'DEF';
    IS_NEW = false;
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        date: new Date(),
        

        hasChange: false,
        dialog_save: false,
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
        this.props.navigation.addListener('willFocus', () => this._willFocus());
        this.props.navigation.addListener('didBlur', () => this._didBlur());
    }

    _willFocus() {
        this.DEF_STATE.id = CommonFunctions.getDocumentID(this.PREFIX_ID);
        this.DEF_STATE.date = new Date();
        this.setState(this.props.navigation.getParam('document') || this.DEF_STATE);

        this.IS_NEW = !this.props.navigation.getParam('document');

        BackHandler.addEventListener('hardwareBackPress', this._goBack);
    }

    _didBlur() {
        BackHandler.removeEventListener('hardwareBackPress', this._goBack);
    }

    // Возвращает структуру, предназначенную для отправки на сервер.
    _prepareToSend() {
        return null;
    }

    // Вызывается при нажатии аппаратной кнопки "Назад", и кнопки "Назад" в Header'е
    _goBack = () => {
        if (this.state.hasChange) {
            this.setState({dialog_save: true});
            return true;
        }
        this.props.navigation.navigate(this.props.navigation.getParam('previousScreen') || this.LIST_SCREEN);
        return true;
    };

    _goBackForce = () => {
        this.props.navigation.navigate(this.props.navigation.getParam('previousScreen') || this.LIST_SCREEN);
        return true;
    };
    // Отправка на сервер
    _save = () => {
        this.setState({processing: true});
        console.log(this._prepareToSend());
        MobidServer1C.fetch(this.DESTINATION, this._prepareToSend())
            .then(result => {
                this.setState({processing: false, hasChange: false}, () => {
                    this._goBackForce();
                });
                Alert.alert('', result.message);
            })
            .catch((error) => {
                this.setState({processing: false});
                Alert.alert("Ошибка отправки", error.message || error.toString());
            });
    };

    _getHeader() {
        return (
            <AppHeader
                navigation={this.props.navigation}
                leftIcon="arrow-back"
                rightIcon={'done'}
                title={this.TITLE}
                leftIconAction={this._goBack}
                rightIconAction={this._save}
            />
        );
    }

    _getBody() {
        return <Text> Document Example </Text>;
    }

    render() {
        return (
            <ScrollView style={styles.container}>

                {this._getHeader()}

                {this._getBody()}

                <DialogSave
                    visible={this.state.dialog_save}
                    onPressNo={() => {
                        this.setState({hasChange: false, dialog_save: false}, () => {
                            this._goBack();
                        });
                    }}
                    onPressYes={() => {
                        this.setState({dialog_save: false}, () => {
                            this._save();
                        });
                    }}
                />

                <DialogProcess
                    visible={this.state.processing}
                />

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

export default DocumentDetails;
