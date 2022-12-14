'use strict';

import React from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import CommonFunctions from '../../helpers/CommonFunctions';
import {ListItem} from 'react-native-elements';
import MobidServer1C from '../../helpers/MobidServer1C';
import DocumentList from '../../prototypes/DocumentList';

export class PurchasesList extends DocumentList {

    static navigationOptions = CommonFunctions.getNavigationOptions('ПТУ(Поставщики)', 'shopping-cart', 'font-awesome');

    ASYNC_STORAGE_KEY = 'DocumentsP';
    TITLE = 'ПТУ(Поставщики)';
    DOCUMENT_DETAILS_SCREEN = 'PurchaseDetails';

    _willFocus() {

        CommonFunctions.stack = null;

        let params = {
            UserCode: global.user.name,
            UserKey: global.user.key
        };

        MobidServer1C.fetch('GetPurchasesExternalSuppliers', params)// Поставщики
            .then((data) => {
                this.setState({list: data});
            })
            .catch((error) => {
                reject(error.toString());
            });
    }

    render() {
        return (
            <View style={_styles.container}>

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

        if (!rowData.item) {
            return (
                <Text>Нет данных</Text>
            );
        }

        return (
            <ListItem
                pad={20}
                badge={{
                    value: rowData.item.items.length,
                    textStyle: {color: 'white'},
                    containerStyle: {width: 30},
                }}
                key={rowData.item.id}
                title={CommonFunctions.getStringDate(rowData.item.date)}
                subtitle={rowData.item.supplier ? rowData.item.supplier.name : ''}
                rightSubtitle={rowData.item.automatic ? 'Aвто' : ''}
                onPress={this.onPressItem(rowData.item)}
            />
        );
    };
}
const _styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});
export default PurchasesList;
