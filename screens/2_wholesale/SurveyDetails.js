import React from 'react';
import {StyleSheet, ScrollView, View, Text, TextInput, Clipboard, ActivityIndicator} from 'react-native';
import CommonFunctions from '../../helpers/CommonFunctions';
import {CustomerPicker} from '../../components/CustomerPicker';
import {DatePicker} from '../../components/DatePicker';
import Cranes from './components/Cranes';
import Comment from '../../components/Comment';
import MyCamera from '../../components/MyCamera';
import Geolocation from '@react-native-community/geolocation';
import DocumentDetails from '../../prototypes/DocumentDetails';
import {Divider, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {VersionController} from '../../helpers/VersionController';
import MobidServer1C from '../../helpers/MobidServer1C';
import * as firebase from 'firebase';

export class SurveyDetails extends DocumentDetails {

    static navigationOptions = CommonFunctions.getNavigationOptions('Новый опрос', 'add');

    TITLE = 'Опрос';
    LIST_SCREEN = 'HomeScreen';
    ASYNC_STORAGE_KEY = 'Documents';
    PREFIX_ID = 'W';
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        date: new Date(),
        partner: null,
        items: [],
        images: [],
        payments: [],
        tare: [],
        total: '',
        comment: null,
        processing_tare: false,
        processing_money: false,
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
    }

    _save = () => {

        Geolocation.getCurrentPosition(info => {
            info.partner = this.state.partner;
            firebase.database().ref('geo/' + global.user.name).set(info);
        });

        if (!this.state.partner) {
            CommonFunctions.showAlert('Ошибка заполнения документа', 'Не указан клиент');
            return;
        }

        let total = 0;

        this.state.items.forEach(function (item) {
            total += Number(item.quantity);
        });

        if (!this.state.items) {
            CommonFunctions.showAlert('Ошибка заполнения документа', 'Не выбрано ни одного сорта пива');
            return;
        }

        if (!Array.isArray(this.state.images) || this.state.images.length === 0) {
            CommonFunctions.showAlert('Ошибка заполнения документа', 'Не сделано ни одного фото');
            return;
        }

        let err = '';

        if (total !== Number(this.state.total)) {
            //   err += 'Количество кранов ВСЕГО указано неверно \n Указано: ' + this.state.total + ', посчитано: ' + total.toString() + '\n';
        }

        if (err !== '') {
            CommonFunctions.showAlert('Ошибка заполнения документа', err);
            return;
        }

        AsyncStorage.getItem(this.ASYNC_STORAGE_KEY)

            .then(result => {

                let document = this._prepareToSend();
                let list = JSON.parse(result) || [];

                let ind = list.findIndex(item => {
                    return item.id === document.id;
                });

                if (ind >= 0) {
                    list[ind] = document;
                } else {
                    list.push(document);
                }

                AsyncStorage.setItem(this.ASYNC_STORAGE_KEY, JSON.stringify(list)).then(res => {
                    this.props.navigation.goBack();
                });
            });
    };

    _prepareToSend() {
        return {
            id: this.state.id,
            date: this.state.date,
            partner: this.state.partner,
            items: this.state.items,
            images: this.state.images,
            total: this.state.total,
            comment: this.state.comment,
        };
    }

    addToClipboard() {
        let str = '';
        this.state.payments.forEach(payment => {
            str += payment.organization + '\n' + payment.sum + '\n\n';
        });

        Clipboard.setString(str);
    }

    _getBody() {
        return (
            <ScrollView style={styles.container}>

                <VersionController/>

                <DatePicker
                    value={this.state.date}
                    onChange={(date) => this.setState({date: date})}
                />

                <CustomerPicker
                    value={this.state.partner}
                    onChange={(partner) => this.onChangePartner(partner)}
                />

                <View style={{backgroundColor: '#fff'}}>
                    <Text style={styles.labelTotal}>Всего кранов</Text>
                    <TextInput
                        style={styles.inputTotal}
                        keyboardType={'numeric'}
                        editable={true}
                        value={this.state.total}
                        onChangeText={(text) => this.setState({total: text})}
                    />
                    <Divider/>
                </View>

                <Cranes
                    value={this.state.items}
                    onChange={(list) => this.setState({items: list})}
                />

                <MyCamera
                    images={this.state.images}
                    onTakePicture={(image) => this.addImage(image)}
                />

                <Comment
                    value={this.state.comment}
                    onChange={(text) => this.setState({comment: text})}
                />

                {this.getCalculations()}
            </ScrollView>
        );
    }

    getCalculations() {
        return (
            <View>
                {this.state.calcLoading &&
                <ActivityIndicator size="large" color="#ddf"/>
                }

                {this.state.payments && this.state.payments.length > 0 &&
                <View>
                    <Text>{' ' + 'Сальдо, Руб:'}</Text>

                    {this.state.payments.map(item => {
                        return (
                            <View>
                                <Text>{'    ' + item.organization}</Text>
                                <Text>{'    ' + item.sum}</Text>
                                <Divider/>
                            </View>
                        );
                    })}

                    <Text>{' ' + 'Тара, Шт:'}</Text>

                    {this.state.stuff && this.state.stuff.map(item => {
                        return (
                            <View style={{flexDirection: 'row'}}>
                                <Text>{'    ' + item.good}</Text>
                                <Text style={{right: 5, position: 'absolute'}}>{item.quantity}</Text>
                                <Divider/>
                            </View>
                        );
                    })}

                </View>

                }
                <Icon
                    onPress={() => this.addToClipboard()}
                    icon={{name: 'copy', color: '#999', type: 'font-awesome'}}
                    buttonStyle={styles.copyBtn}
                />
            </View>
        );
    }

    addImage(image) {
        this.setState({images: this.state.images.concat(image)});
    }

    onChangePartner(partner) {

        this.setState({partner: partner, calcLoading: true});

        if (!global.templates) {
            return;
        }

        MobidServer1C.fetch('GetCalculations', {partnerId: partner.id})
            .then((data) => {

                console.log(data);

                this.setState({
                    payments: data.payments,
                    stuff: data.stuff,
                    calcLoading: false,
                });
            }).catch(err => {
            console.log(err);
            this.setState({calcLoading: false});
        });

        global.templates.forEach(item => {
            if (item.partner === partner.id) {
                let newItems = [];

                if (Array.isArray(item.cranes)) {
                    item.cranes.forEach(crane => {
                        newItems.push({name: crane.name, id: crane.id, quantity: crane.count, price: crane.price});
                    });
                    this.setState({items: newItems});
                }
            }
        });
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    labelTotal: {
        marginTop: 5,
        color: '#89a',
        left: 15,
    },
    inputTotal: {
        padding: 5,
        color: '#456',
        fontSize: 14,
        paddingLeft: 15,
        height: 30,
        paddingRight: 20,
        flexWrap: 'wrap',
    },
    copyBtn: {
        width: 80,
        margin: 5,
    },
});

export default SurveyDetails;
