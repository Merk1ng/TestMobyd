'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    FlatList,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {Icon, ListItem} from 'react-native-elements';
import * as firebase from 'firebase';
import CommonFunctions from '../../helpers/CommonFunctions';
import Fab from '../../components/Fab';
import MobidServer1C from '../../helpers/MobidServer1C';
import DocumentList from '../../prototypes/DocumentList';

export class InternalOrdersList extends DocumentList {

    static navigationOptions = CommonFunctions.getNavigationOptions('Заказы на склад', 'parachute', 'material-community');

    ASYNC_STORAGE_KEY = 'DocumentsIO';
    TITLE = 'Заказы на склад';
    DOCUMENT_DETAILS_SCREEN = 'InternalOrderDetails';

    _willFocus() {

        CommonFunctions.stack = null;

        let params = {
            UserCode: global.user.name,
            UserKey: global.user.key
        };

        MobidServer1C.fetch('GetInternalOrders', params)
            .then((data) => {
                this.setState({list: data});
            })
            .catch((error) => {
                reject(error.toString());
            });
    }

    renderItem = rowData => {
        return (
            <ListItem
                pad={20}
                leftIcon={CommonFunctions.getDocIcon(rowData.item)}
                badge={{
                    value: rowData.item.items.length,
                    textStyle: {color: 'white'},
                    containerStyle: {width: 30},
                }}
                key={rowData.item.id}
                title={CommonFunctions.getStringDate(rowData.item.date)}
                subtitle={rowData.item.id}
                rightSubtitle={rowData.item.automatic ? 'Aвто' : ''}
                onPress={this.onPressItem(rowData.item)}
            />
        );
    };
}

export default InternalOrdersList;
