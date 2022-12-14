import React, {Component} from 'react';
import {Icon, ListItem, CheckBox} from 'react-native-elements';
import CommonFunctions from '../../helpers/CommonFunctions';
import DocumentOperations from '../../helpers/DocumentOperations';
import DocumentList from '../../prototypes/DocumentList';
import {StyleSheet} from 'react-native';
import MobidServer1C from '../../helpers/MobidServer1C';

export class InventoryList extends DocumentList {

    // @Override
    static navigationOptions = CommonFunctions.getNavigationOptions('Инвентаризации', 'calculator', 'material-community');

    ASYNC_STORAGE_KEY = 'Documents_Inventory';
    TITLE = 'Инвентаризации';
    DOCUMENT_DETAILS_SCREEN = 'InventoryDetails';
    EMPTY_DOCUMENT = {
        id: CommonFunctions.getDocumentID('DEF'),
        date: new Date(),
        items: [],
        type: 'Тара'
    };

    _willFocus() {

        CommonFunctions.stack = null;

        let params = {
            UserCode: global.user.name,
            UserKey: global.user.key
        };

        MobidServer1C.fetch('GetInventory', params)
            .then((data) => {
                this.setState({list: data});
            })
            .catch((error) => {
                reject(error.toString());
            });
    }


    renderItem = (rowData) => {

        let item = rowData.item;

        /* тут надо вкрутить проверок... */

        return (
            <ListItem
                title={CommonFunctions.getStringDate(item.date)}
                rightSubtitle={item.type}
                rightSubtitleStyle={styles.rightSubtitle}
                key={item.id}
                bottomDivider={true}
                subtitle={item.status}
                onPress={this.onPressItem(item)}
                onLongPress={this.onLongPressItem(item)}
            />
        );
    };
}

const styles = StyleSheet.create({
    rightSubtitle: {
        textAlign: 'left',
        width: '100%'
    }
});

export default InventoryList;
