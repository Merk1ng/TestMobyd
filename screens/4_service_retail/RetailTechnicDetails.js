import React from 'react';
import {StyleSheet, Alert, View} from 'react-native';
import AppHeader from '../../components/AppHeader';
import CommonFunctions from '../../helpers/CommonFunctions';
import * as firebase from 'firebase';
import Comment from '../../components/Comment';
import {DatePicker} from '../../components/DatePicker';
import {RetailServicePicker} from './components/RetailServicePicker';
import {CustomerPicker} from '../../components/CustomerPicker';
import DocumentDetails from '../../prototypes/DocumentDetails';
import AsyncStorage from '@react-native-community/async-storage';

export class RetailTechnicDetails extends DocumentDetails {

    static navigationOptions = CommonFunctions.getNavigationOptions('Новая заявка', 'add');

    TITLE = 'Заявка';
    LIST_SCREEN = 'HomeScreen';
    ASYNC_STORAGE_KEY = 'Documents';
    PREFIX_ID = 'RT';
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        date: new Date(),
        market: null,
        items: [],
        comment: '',
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
    }

    _save = () => {
        this.setState({processing: true});
        firebase.database().ref('i/' + global.user.name + '/' + this.state.id).set(this._prepareToSend(), success => {
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
                        this.setState({processing: false});
                        this.props.navigation.navigate('HomeScreen');
                        Alert.alert('Документ успешно отправлен');

                    });
                });
        });
    };

    _prepareToSend() {
        return {
            id: this.state.id,
            date: this.state.date,
            market: this.state.market,
            items: this.state.items,
            comment: this.state.comment,
        };
    }

    _getBody() {
        return (
            <View>

                <CustomerPicker
                    value={this.state.market}
                    onChange={(market) => this.setState({market: market})}
                />

                <RetailServicePicker
                    value={this.state.items}
                    onChange={(list) => this.setState({items: list})}
                />

                <Comment
                    disabled={false}
                    value={this.state.comment}
                    onChange={(value) => {
                        this.setState({comment: value});
                    }}
                />
            </View>
        );
    }
}


export default RetailTechnicDetails;
