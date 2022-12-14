import React from 'react';
import {StyleSheet, AsyncStorage, ScrollView, BackHandler} from 'react-native';
import {DropdownPicker} from '../../components/DropdownPicker';
import AppHeader from "../../components/AppHeader";
import StorageGoodsPicker from "../3_retail/components/StorageGoodsPicker";
import {DatePicker} from "../../components/DatePicker";
import {RetailComment} from "../../components/RetailComment";
import {DialogSave} from "../../components/DialogSave";
import CommonFunctions from "../../helpers/CommonFunctions";
import * as firebase from "firebase";

var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

let emptyDocument = {
    id: null,
    status: 'draft',
    date: new Date(),
    shipment: tomorrow,
    organization: null,
    storage: null,
    items: [],
    saveDialog: false,
    hasChange: false,
    automatic: false,
    comment: ""
};

export class FoodServiceOrderDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = emptyDocument;
    }

    onBackPress = () => {
        if (this.state.hasChange) {
            this.setState({saveDialog: true});
            return true;
        }
        this.props.navigation.navigate('InternalOrderList');
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        return true;
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.props.navigation.addListener('willFocus', () => this.willFocus());
    }

    willFocus() {
        let doc = this.props.navigation.getParam('document');
        if (!doc) {
            doc = JSON.parse(JSON.stringify(emptyDocument));
            doc.id = CommonFunctions.getDocumentID("IO");
            doc.organization = global.organizations[0];
            doc.storage = global.storages[0];
        } else {
            doc.organization = CommonFunctions.getReference(doc.organization, global.organizations);
            doc.storage = CommonFunctions.getReference(doc.storage, global.storages);
        }
        doc.hasChange = false;
        this.setState(doc);
    }

    save() {
        if (!Array.isArray(global.internalOrdersDraft))
            global.internalOrdersDraft = [];
        if (!Array.isArray(global.internalOrders))
            global.internalOrders = [];

        let finded = false;
        for (let i = 0; i < global.internalOrdersDraft.length; i++) {
            if (this.state.id === global.internalOrdersDraft[i].id) {
                global.internalOrdersDraft[i] = this.state;
                finded = true;
            }
        }

        if (!finded) {
            global.internalOrdersDraft.push(JSON.parse(JSON.stringify(this.state)));
        }

        AsyncStorage.setItem('internalOrdersDraft', JSON.stringify(global.internalOrdersDraft)).then(result => {
            this.props.navigation.navigate('InternalOrderList');
        });
    }

    _saveDocument() {

        this.save();

        let promise = new Promise((resolve, reject) => {
            firebase.database().ref('i/' + global.user.name + '/InternalOrders/' + this.state.id).set(this.state, function (success) {
                resolve('success');
            });
        });

        promise.then(result => {
            this.setState({status: 'new'});
            this.save();
        })

    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="arrow-back"
                    rightIcon={this.state.status === "new" || this.state.status === "draft" ? "done" : "more-vert"}
                    title="Заказ на склад"
                    leftIconAction={() => this.onBackPress()}
                    rightIconAction={() => {
                        if (this.state.status === "new" || this.state.status === "draft") {
                            this._saveDocument();
                        } else {
                            // this.setState({items: [this.state.items[1]]})
                        }
                    }}
                />

                <DatePicker
                    value={this.state.shipment}
                    disabled={this.state.status !== "new" || this.state.status !== "draft"}
                    onChange={(date) => this.setState({shipment: date})}
                />

                <DropdownPicker
                    disabled={this.state.status !== "new" && this.state.status !== "draft"}
                    title="Организация"
                    value={this.state.organization}
                    items={global.organizations}
                    onChange={(value) => this.setState({organization: value})}
                />

                {global.storages && Array.isArray(global.storages) && global.storages.length > 1 &&
                <StoragePicker
                    disabled={this.state.status !== "new" && this.state.status !== "draft"}
                    value={this.state.storage}
                    onChange={(value) => this.setState({storage: value})}
                />
                }

                <StorageGoodsPicker
                    disabled={this.state.status !== "new" && this.state.status !== "draft"}
                    value={this.state.items}
                    status={this.state.status}
                    onChange={(list) => {
                        this.setState({items: list, hasChange: true})
                    }}
                />


                <RetailComment
                    disabled={this.state.status !== "new" && this.state.status !== "draft"}
                    value={this.state.comment}
                    onChange={(value) => {
                        this.setState({comment: value})
                    }}
                />

                <DialogSave
                    visible={this.state.saveDialog}
                    onPressNo={() => {
                        this.props.navigation.navigate('InternalOrderList');
                        this.setState({saveDialog: false});
                    }}
                    onPressYes={() => {
                        this._saveDocument();
                        this.setState({saveDialog: false});
                    }}
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
    item: {
        padding: 5,
        color: '#789',
        fontSize: 14,
        paddingLeft: 15,
        height: 30,
    },
    saveBtn: {
        marginTop: 20
    }
});

export default FoodServiceOrderDetails;
