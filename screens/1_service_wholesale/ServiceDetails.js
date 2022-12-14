import React from 'react';
import {StyleSheet, AsyncStorage, View} from 'react-native';
import {CustomerPicker} from '../../components/CustomerPicker';
import {DatePicker} from '../../components/DatePicker';
import {ServicePicker} from './components/ServicePicker';
import CommonFunctions from '../../helpers/CommonFunctions';
import DocumentDetails from '../../prototypes/DocumentDetails';

export class ServiceDetails extends DocumentDetails {

    static navigationOptions = CommonFunctions.getNavigationOptions('Новая заявка', 'add');

    TITLE = 'Заявка';
    LIST_SCREEN = 'HomeScreen';
    ASYNC_STORAGE_KEY = 'Documents';
    PREFIX_ID = 'T';
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        date: new Date(),
        partner: null,
        items: [],
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
    }

    _save = () => {
        AsyncStorage.getItem(this.ASYNC_STORAGE_KEY)
            .then(result => {
                let document = this._prepareToSend();
                let list = JSON.parse(result) || [];
                console.log(list);
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
        };
    }

    _getBody() {
        return (
            <View>
                <DatePicker
                    value={this.state.date}
                    onChange={(date) => this.setState({date: date})}
                />

                <CustomerPicker
                    value={this.state.partner}
                    onChange={(partner) => this.setState({partner: partner})}
                />

                <ServicePicker
                    value={this.state.items}
                    onChange={(list) => this.setState({items: list})}
                />
            </View>
        );
    }
}

export default ServiceDetails;
