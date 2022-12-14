import React, {Component} from 'react';
import {Icon, ListItem, CheckBox, ButtonGroup} from 'react-native-elements';
import CommonFunctions from '../../helpers/CommonFunctions';
import DocumentOperations from '../../helpers/DocumentOperations';
import DocumentList from '../../prototypes/DocumentList';
import {FlatList, StyleSheet, View} from 'react-native';

export class SurveyList extends DocumentList {

    static navigationOptions = CommonFunctions.getNavigationOptions('Главная', 'home');

    ASYNC_STORAGE_KEY = 'Documents';
    TITLE = 'Опросы';
    DOCUMENT_DETAILS_SCREEN = 'DetailsScreen';

    constructor(props) {
        super(props);
    }

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

const styles = StyleSheet.create({
    rightSubtitle: {
        textAlign: 'left',
        width: '100%',
    },
});

export default SurveyList;
