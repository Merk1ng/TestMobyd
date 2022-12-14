import React from 'react';
import {ListItem} from "react-native-elements";
import CommonFunctions from "../../helpers/CommonFunctions";
import DocumentList from '../../prototypes/DocumentList';

export class RetailTechnicList extends DocumentList {

    static navigationOptions = CommonFunctions.getNavigationOptions('Заявки техников', 'wrench', 'font-awesome');

    ASYNC_STORAGE_KEY = 'Documents';
    TITLE = 'Заявки техников';
    DOCUMENT_DETAILS_SCREEN = 'DetailsScreen';

    constructor(props) {
        super(props);
    }

    renderItem = (rowData) => {

        let item = rowData.item;

        return (
            <ListItem
                pad={20}
                key={item.id}
                title={CommonFunctions.getStringDate(item.date)}
                subtitle={item.market.name}
                onPress={this.onPressItem(item)}
            />
        )
    }
}

export default RetailTechnicList;
