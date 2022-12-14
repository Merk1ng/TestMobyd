import React, {Component} from 'react';
import CommonFunctions from '../../helpers/CommonFunctions';
import {ListItem} from 'react-native-elements';
import DocumentList from '../../prototypes/DocumentList';

export class ServiceList extends DocumentList {

    static navigationOptions = CommonFunctions.getNavigationOptions('Главная', 'home');

    ASYNC_STORAGE_KEY = 'Documents';
    TITLE = 'Заявки';
    DOCUMENT_DETAILS_SCREEN = 'DetailsScreen';

    renderItem = (rowData) => {

        let item = rowData.item;

        return (
            <ListItem
                key={item.id}
                title={CommonFunctions.getStringDate(item.date)}
                subtitle={item.partner.name}
                onPress={this.onPressItem(item)}
            />
        );
    };
}

export default ServiceList;
