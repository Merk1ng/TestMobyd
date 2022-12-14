import React from 'react';
import {View} from 'react-native';
import {CategoryPicker} from '../../components/CategoryPicker';
import InventoryGoodsPicker from './components/InventoryGoodsPicker';
import DocumentDetails from '../../prototypes/DocumentDetails';
import {DialogProcess} from '../../components/DialogProcess';
import CommonFunctions from '../../helpers/CommonFunctions';

export class InventoryDetails extends DocumentDetails {

    TITLE = 'Инвентаризация';
    LIST_SCREEN = 'InventoryList';
    PREFIX_ID = 'INV';
    DESTINATION = "NewInventory";
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        date: new Date(),
        storage: global.storages[0],
        items: [],

        saveDialog: false,
        hasChange: false,
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
    }

    setType = (data) => {
        this.setState({
            type: data,
            items: global.inventory.filter(item => {
                return item.type === data;
            }),
        });
    };
_prepareToSend(): null {
    return this.state;
}

    _getBody() {
        return (
            <View>
                <CategoryPicker
                    value={this.state.type}
                    onChange={this.setType}
                />

                <InventoryGoodsPicker
                    value={this.state.items}
                    status={this.state.status}
                    onChange={(list) => this.setState({items: list})}
                />

                <DialogProcess
                    visible={this.state.processing}
                />
            </View>
        );
    }
}

export default InventoryDetails;
