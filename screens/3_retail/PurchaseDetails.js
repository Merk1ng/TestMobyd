import React from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    ScrollView,
    FlatList,
    Picker,
    Text,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity, 
    View, 
    BackHandler,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {DropdownPicker} from '../../components/DropdownPicker';
import SupplierGoodsPicker from '../../components/SupplierGoodsPicker';
import {DatePicker} from '../../components/DatePicker';
import StorageGoodsPicker from './components/StorageGoodsPicker';
import {RetailComment} from '../../components/RetailComment';
import CommonFunctions from '../../helpers/CommonFunctions';
import * as firebase from 'firebase';
import {
    ListItem,
    Input,
    FormLabel,
    Image,
    SearchBar, Divider, Button, Icon,
} from 'react-native-elements';
import MobidServer1C from '../../helpers/MobidServer1C';
import PurchaseGoodsPicker from './components/PurchaseGoodsPicker';
import {DialogProcess} from '../../components/DialogProcess';
import DocumentScanner from './components/DocumentScanner';
import DocumentDetails from '../../prototypes/DocumentDetails';

var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export class PurchaseDetails extends DocumentDetails {

    TITLE = 'ПТУ'; //поставщик
    LIST_SCREEN = 'PurchasesList';
    ASYNC_STORAGE_KEY = 'DocumentsP';
    DESTINATION = 'NewPurchase';
    PREFIX_ID = 'P';
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        date: new Date(),
        shipment: tomorrow,
        storage: global.storages[0],
        organization: global.organizations[0],
        parent: null,
        supplier: global.suppliers[0],
        items: [],
        automatic: false,
        comment: '',
        allowedAccept: '',
        refUPD: this.state.refUPD,

        saveDialog: false,
        hasChange: false,
        scanVisible: false,
        scanUploadProcessing: false,
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
    }

    _willFocus() {
        this.DEF_STATE.id = CommonFunctions.getDocumentID(this.PREFIX_ID);
        this.DEF_STATE.date = new Date();
        let document = this.props.navigation.getParam('document');
        //console.log(this.props.navigation.getParam('document'));
        if(this.props.navigation.getParam('document')) {
            //Alert.alert('123');
            //Alert.alert('Поставщик', JSON.stringify(this.props.navigation.getParam('document').supplier) )
             document.supplier = CommonFunctions.getReferenceOnSupplier(this.props.navigation.getParam('document').supplier, global.suppliers);
            // Alert.alert('', JSON.stringify(this.props.navigation.getParam('document').supplier) );
 
         }
        
        
         this.setState(document || this.DEF_STATE);

        this.IS_NEW = !this.props.navigation.getParam('document');

        BackHandler.addEventListener('hardwareBackPress', this._goBack);
    }

    _prepareToSend() {
        return {
            id: this.state.id, //CommonFunctions.getDocumentID(this.PREFIX_ID),
            date: this.state.date,
            shipment: tomorrow,
            supplier: this.state.supplier,
            organization: this.state.organization,
            parent: this.state.parent,
            storage: global.storages[0].guid,
            scanURL: this.state.scanURL,
            items: this.state.items.map(item => {
                return {
                    id: item.id, //CommonFunctions.getDocumentID(this.PREFIX_ID),
                    quantity: item.quantity,
                    unit_id: item.unit_id,
                    price: item.price,
                };
            }),
            comment: this.state.comment,
            refUPD: this.state.refUPD,
        };
    }

    renderGoodItem = (rowData) => {
        let item = rowData.item;
        return (
            <TouchableOpacity
            
                style={{flexDirection: 'row'}}
               // onPress={() => {
                 //                 this.setState({item: rowData.item, itemView: rowData.item.name});
                   //               this.askQuantity(true);
                     //         }}
                       //       onLongPress={() => {
                         //         console.warn('ev');
                           //       this.setState({
                             //         item: rowData.item,
                                //      itemView: rowData.item.name,
                                  //    askDeleteVisible: true,
                                  //});
                              //}}
                              >
        
                <Text
                   onPress={() => {
                    this.setState({
                        dialog_quantity: true,
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    });
                }}
                    numberOfLines={2}
                    style={styles.item}>{item.name}
                </Text>
                <Text
                    style={styles.itemC}>{item.quantity}шт. {item.price} р.
                </Text>

            </TouchableOpacity>
        );
    };

    _getBody() {

        let draft = !this.props.navigation.getParam('document');

        return (
            <ScrollView>
                <DropdownPicker
                    disabled={false}
                    title="Организация"
                    items={global.organizations}
                    value={this.state.organization}
                    onChange={(value) => this.setState({organization: value})}
                />

                 <DropdownPicker
                    disabled={false}
                    title="Поставщик"
                    //items={global.suppliers}
                    value={this.state.supplier}
                    onChange={(value) => this.setState({supplier: value})}
                />


                <StorageGoodsPicker
                    draft={draft}
                    value={this.state.items}
                    status={this.state.status}
                    onChange={(list) => this.setState({items: list, hasChange: true})}
                />
                

                {!this.state.items.length ? <Text style={styles.item}>&lt;Добавьте товары </Text> : null}

                

                <PurchaseGoodsPicker
                    disabled={draft}
                    items={this.state.items}
                    value={global.suppliersGoods} // + this.state.supplier.guid]}
                    onChange={(list) => this.setState({items: list})}
                />

                <RetailComment
                    disabled={this.state.status !== 'new' && this.state.status !== 'draft'}
                    value={this.state.comment}
                    onChange={(value) => {
                        this.setState({comment: value});
                    }}
                />
                <Text style={{padding: 8}}>Итого: {this.state.totalSum} ₽</Text>
                <DialogProcess
                    visible={this.state.processing}
                />


                {this.state.scanUploadProcessing &&
                <View>
                    <ActivityIndicator size="large" color="#ccd"/>
                    <Text style={{textAlign: 'center'}}>Идёт выгрузка изображения...</Text>
                </View>
                }
                {this.state.scanURL &&
                <View style={{flexDirection: 'row', padding: 10}}>
                    <Icon name={'attachment'} color={'#ddd'}/>
                    <Text style={{textAlign: 'center'}}>1 вложение.</Text>
                </View>
                }
                <Button
                    onPress={() => {
                        this.setState({scanVisible: true});
                    }}
                    buttonStyle={styles.btnScan}
                    icon={{name: 'scanner', color: '#fff'}}
                    title="Сканировать документ"
                />

                <DocumentScanner
                    modalVisible={this.state.scanVisible}
                    onStartUploading={() => this.setState({scanUploadProcessing: true, scanVisible: false})}

                    onCompleteUploading={(url) => this.setState({scanUploadProcessing: false, scanURL: url})}
                    close={() => {
                        this.setState({scanVisible: false});
                    }}
                />
                <Text style={styles.infoLabel}>* на тёмном фоне документы сканируются лучше</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    item: {
        padding: 5,
        color: '#789',
        fontSize: 14,
        paddingLeft: 15,
        backgroundColor: '#fff',
        height: 50,
    },
    saveBtn: {
        marginTop: 20,
    },
    item33: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        width: Dimensions.get('window').width * 0.8,
        paddingLeft: 8,
        height: 43,
        justifyContent: 'space-between',
    },
    itemC: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        paddingLeft: 8,
        height: 43,
        width: Dimensions.get('window').width * 0.2,
        right: 2,
        position: 'absolute',
    },
    saveBtn33: {
        margin: 10,
    },
    label: {
        marginTop: 5,
        color: '#89a',
        backgroundColor: '#fff',
        left: 8,
    },
    actionBtn: {
        margin: 10,
    },


    btnScan: {
        margin: 10,
    },
    indicator: {
        margin: 40,
    },


    scanner: {
        flex: 1,
        aspectRatio: undefined,
    },
    button: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 32,
    },
    buttonText: {
        backgroundColor: 'rgba(245, 252, 255, 0.7)',
        fontSize: 32,
    },
    preview: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
    },
    permissions: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: -10,
        fontStyle: 'italic',
        fontSize: 13,
    },
});

export default PurchaseDetails;
