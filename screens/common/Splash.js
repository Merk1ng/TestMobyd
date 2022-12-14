import React, {Component} from 'react';
import {StyleSheet, View, Text, Linking, Alert, YellowBox, TextInput, Picker} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from 'firebase';

export class Splash extends Component {

    keys;

    init() {
      //  AsyncStorage.removeItem('Documents').then(res => {
       // });
        switch (global.user.type) {

            case 1:
                this.props.navigation.navigate('TechnicStack');
                this.keys = ['goods', 'customers', 'reports'];
                break;

            case 2:
                this.props.navigation.navigate('WholesaleStack');
                this.keys = ['customers', 'questions'];
                break;

            case 3:
                this.props.navigation.navigate('RetailStack');
                this.keys = ['goods', 'storages', 'organizations', 'suppliers', 'suppliersGoods', 'barcodes',
                    'inventory', 'internalOrders', 'internalOrdersDraft', 'externalOrders', 'externalOrdersDraft',
                    'purchases', 'purchasesDraft', 'technics', 'servicesList', 'hgoods', 'receivedfromsupplier',
                ];
                break;

            case 4:
                this.props.navigation.navigate('RetailTechnicStack');
                this.keys = ['goods', 'customers', 'servicesList'];
                break;

            case 5:
                this.props.navigation.navigate('FoodServiceStack');
                this.keys = ['goods', 'organizations', 'storages'];
                break;

            case 6:
                this.props.navigation.navigate('FranchiseStack');
                this.keys = ['barcodes', 'goods'];
                break;
        }

        let promises = [];
        this.keys.forEach(key => {
            promises.push(AsyncStorage.getItem(key));
        });

        return Promise.all(promises);
    }

    componentDidMount() {

        AsyncStorage.getItem('user').then(user => {

            global.user = JSON.parse(user);

            if (!user) {
                this.props.navigation.navigate('AuthorizationStack');
                return;
            }

            this.init().then(results => {
                this.keys.forEach((key, i) => {
                    let d = JSON.parse(results[i]);
                    global[key] = d ? d : [];
                });

                let d = [];

                this.keys.forEach((key, i) => {
                    d = d.concat(global[key]);
                });

                if (d.length === 0 || this.needUPD(global.user)) {
                    let newUser = JSON.parse(user);
                    newUser.lastUPD = new Date().toISOString();
                    AsyncStorage.setItem('user', JSON.stringify(newUser)).then(res => {
                    });
                    this.props.navigation.navigate('Downloading');
                }


            }).catch(err => {
                Alert.alert('Не удалось загрузить данные', JSON.stringify(err));
                console.log(err);
            });
        });
    }

    needUPD(user) {

        let currDate = new Date().getTime();

        if (!user) {
            return true;
        } else if (!user.lastUPD) {
            return true;
        } else if (currDate - new Date(user.lastUPD).getTime() > 1000 * 86400 * 2) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text> Загрузка... </Text>
            </View>
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
});

export default Splash;
