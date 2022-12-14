import React, {Component} from 'react';
import {StyleSheet, Text, Modal, View, Alert, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Icon} from 'react-native-elements';
import * as firebase from 'firebase';
import MobidServer1C from '../../helpers/MobidServer1C';
import CommonFunctions from '../../helpers/CommonFunctions';

export class Downoading extends Component {

    static navigationOptions = CommonFunctions.getNavigationOptions('Загрузка', 'cloud-download');

    constructor(props) {
        super(props);
        this.state = {loading: true};
        this.props.navigation.addListener('willFocus', () => this.willFocus());
    }
    
    willFocus() {

        this.setState({loading: true, dismissed: false});

        this.download().then(results => {
            console.log('trying...');
            Alert.alert('Загрузка выполнена', this.getMessage());
            firebase.database().ref('accounts/version/' + global.user.name).set('6.1.20');
            this.dismiss();
        }).catch(err => {
            console.log(err);
            Alert.alert('Ошибка загрузки', JSON.stringify(err));
            this.dismiss();
        });
    };

    download() {
        console.log('starting...');
        return new Promise((resolve, reject) => {

            MobidServer1C.fetch('GetCatalogueData', {})
                .then((data) => {
                    let promises = [];
                    console.log(Object.keys(data));
                    Object.keys(data).forEach(key => {
                        global[key] = data[key];
                        promises.push(AsyncStorage.setItem(key, JSON.stringify(data[key])));
                    });
                    Promise.all(promises).then(result => {
                        AsyncStorage.removeItem('Documents');
                        resolve('success');
                    }).catch(err => {
                        reject(err.toString());
                    });
                })
                .catch((error) => {
                   reject(error.toString());
                });
        });
    }

    getMessage() {
        let str = '';

        if (Array.isArray(global.customers) && global.customers.length) {
            str += 'Контрагенты: ' + global.customers.length + '\n';
        }

        if (Array.isArray(global.goods) && global.goods.length) {
            str += 'Номенклатура: ' + global.goods.length + '\n';
        }

        if (Array.isArray(global.reports) && global.reports.length) {
            str += 'Заказов: ' + global.reports.length + '\n';
        }

        if (Array.isArray(global.templates) && global.templates.length) {
            str += 'Шаблонов: ' + global.templates.length + '\n';
        }

        if (Array.isArray(global.storages) && global.storages.length) {
            str += 'Складов: ' + global.storages.length + '\n';
        }

        if (Array.isArray(global.organizations) && global.organizations.length) {
            str += 'Организаций: ' + global.organizations.length + '\n';
        }

        if (Array.isArray(global.suppliers) && global.suppliers.length) {
            str += 'Поставщиков: ' + global.suppliers.length + '\n';
        }

        if (Array.isArray(global.technics) && global.technics.length) {
            str += 'Техников: ' + global.technics.length + '\n';
        }

        if (Array.isArray(global.barcodes) && global.barcodes.length) {
            str += 'Штрихкоды: ' + global.barcodes.length + '\n';
        }

        // if (Array.isArray(global.questions) && global.questions.length) {
        //     str += 'Чек-лист посещения: ' + global.questions.length + '\n';
        // }
        // if (Array.isArray(global.receivedfromsupplier) && global.receivedfromsupplier.length) {
        //     str += 'УПД: ' + global.receivedfromsupplier.length + '\n';
        // }
console.log(str);
        return str;
    }

    dismiss() {
        this.setState({loading: false});
        this.props.navigation.goBack();
    }

    render() {
        return (
            <Modal visible={this.state.loading}>
                <View style={styles.container}>
                    <Text style={styles.text}>Идёт загрузка данных</Text>
                    <ActivityIndicator size="large" color="#0000ff" style={styles.indicator}/>
                    <Button
                        onPress={() => this.dismiss()}
                        title="Скрыть"
                        type="outline"
                    />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    text: {
        fontSize: 20,
    },
    indicator: {
        margin: 40,
    },
});

export default Downoading;




