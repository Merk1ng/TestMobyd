import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    FlatList, TextInput,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {Icon, ListItem} from 'react-native-elements';
import * as firebase from 'firebase';
import CommonFunctions from '../../helpers/CommonFunctions';
import DeliveriesDate from '../../helpers/DeliveriesDate';
import Fab from '../../components/Fab';
import MobidServer1C from '../../helpers/MobidServer1C';
import DocumentList from '../../prototypes/DocumentList';
import Dialog, {DialogButton, DialogContent, DialogFooter, DialogTitle} from 'react-native-popup-dialog';

export class ExternalOrdersList extends DocumentList {

    static navigationOptions = CommonFunctions.getNavigationOptions('Заказы поставщикам', 'truck', 'font-awesome');

    ASYNC_STORAGE_KEY = 'DocumentsEO';
    TITLE = 'Заказы поставщикам с УПД';
    DOCUMENT_DETAILS_SCREEN = 'ExternalOrderDetails';

    constructor(props) {
        super(props);
        this.state.dialog_filter = false;
    }

    _willFocus() {

        CommonFunctions.stack = null;

        let params = {
            UserCode: global.user.name,
            UserKey: global.user.key,
        };

        MobidServer1C.fetch('GetExternalOrdersNoReceipts', params)
            .then((data) => {
                this.setState({list: data});
            })
            .catch((error) => {
                reject(error.toString());
            });
    }

    onClickFilterIcon() {
        this.setState({dialog_filter: true});
    }



    render() {
                return (
                    <View style={styles.container}>
        
                        {this.getHeader()}
    
                       <FlatList
                           data={this.state.list}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                        />
        
                        {this.getDialogFilter()}
        
                    </View>
                );
           }
        
    renderItem = rowData => {
        let item = rowData.item;
        return (
            <ListItem
                pad={20}
                key={item.id}
                title={CommonFunctions.getStringDate(item.date) + ' -  ' + CommonFunctions.getStringDateddMMMM(item.shipment)}  //DeliveriesDate.getStringDateddMMMM(item.DateDelay) <-Дата просрочки
                /*title1={DeliveriesDate.getStringDateddMMMM(item.shipment)}/*Дата поставки*/
                subtitle={item.supplier ? item.supplier.name : ''}
                rightSubtitle={item.delay ? 'Просрочен!' + '\n' + DeliveriesDate.getStringDateddMMMM(item.DateDelay): ''}
                rightSubtitl={item.delay ? 'Поставка пришла!' + '\n' + DeliveriesDate.getStringDateddMMMM(item.DeliveryArrived): ''}
                rightSubtitleStyle = {{color: 'red'}}
                rightSubtitleStyl = {{color: 'green'}}
                onPress={this.onPressItem(item)}
            />/*Заказы поставщикам Дата Поставщик*/
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

export default ExternalOrdersList;
