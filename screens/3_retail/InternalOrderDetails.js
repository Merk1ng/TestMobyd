import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import StorageGoodsPicker from './components/StorageGoodsPicker';
import {DatePicker} from '../../components/DatePicker';
import {RetailComment} from '../../components/RetailComment';
import CommonFunctions from '../../helpers/CommonFunctions';
import DocumentDetails from '../../prototypes/DocumentDetails';

var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export class InternalOrderDetails extends DocumentDetails {

    TITLE = 'Заказ на склад!';
    LIST_SCREEN = 'InternalOrderList';
    ASYNC_STORAGE_KEY = 'DocumentsIO';
    DESTINATION = 'NewInternalOrder';
    PREFIX_ID = 'IO';
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        date: new Date(),
        shipment: tomorrow,
        storage: global.storages[0],
        items: [],
        automatic: false,
        comment: '',

        saveDialog: false,
        hasChange: false,
        scanVisible: false,
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
    }

    _prepareToSend() {
        return {
            id: this.state.id,
            date: this.state.date,
            shipment: tomorrow,
            items: this.state.items,
            comment: this.state.comment,
        };
    }

    _getBody() {
        let draft = !this.props.navigation.getParam('document');

        return (
            <ScrollView style={styles.container}>

                <DatePicker
                    disabled={draft}
                    value={this.state.shipment}
                    onChange={(date) => this.setState({shipment: date, hasChange: true})}
                />

                <StorageGoodsPicker
                    draft={draft}
                    value={this.state.items}
                    status={this.state.status}
                    onChange={(list) => this.setState({items: list, hasChange: true})}
                />

                <RetailComment
                    disabled={draft}
                    value={this.state.comment}
                    onChange={(value) => this.setState({comment: value, hasChange: true})}
                />

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

export default InternalOrderDetails;
