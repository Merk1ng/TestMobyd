import React from 'react';
import { StyleSheet, Alert, ScrollView, FlatList, BackHandler, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { DropdownPicker } from '../../components/DropdownPicker';
import SupplierGoodsPicker from '../../components/SupplierGoodsPicker';
import OverdueOrderCollector from '../../components/OverdueOrderCollector'
import { DatePicker } from '../../components/DatePicker';
import { RetailComment } from '../../components/RetailComment';
import { DialogProcess } from '../../components/DialogProcess';
import DocumentDetails from '../../prototypes/DocumentDetails';
import CommonFunctions from '../../helpers/CommonFunctions';
import AppHeader from '../../components/AppHeader';
import PopupDialog, { Dialog } from 'react-native-popup-dialog/src';
import DeliveriesDate from '../../helpers/DeliveriesDate';
import { DialogButton, DialogContent, DialogFooter, DialogTitle } from 'react-native-popup-dialog';
import { Button } from 'react-native';
import MobidServer1C from '../../helpers/MobidServer1C';

var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export class ExternalOrderDetails extends DocumentDetails {
 
    TITLE = 'УПД';
    ASYNC_STORAGE_KEY = 'DocumentsEO';
    LIST_SCREEN = 'ExternalOrderList';
    DESTINATION = 'NewExternalOrder';
    PREFIX_ID = 'EO';
    DEF_STATE = {
        id: CommonFunctions.getDocumentID(this.PREFIX_ID),
        status: 'draft',
        date: new Date(),
        shipment: new Date(),
        supplier: null,
        organization: null,
        dialog_createPurchase: false,
        storage: null,
        items: [],
        comment: '',
        totalSum: 0,
        allowedAccept: true,
        
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
    
    }

    _willFocus() {
        this.DEF_STATE.id = CommonFunctions.getDocumentID(this.PREFIX_ID);
        this.DEF_STATE.date = new Date();
        let document = this.props.navigation.getParam('document');
        if (this.props.navigation.getParam('document')) {
            //Alert.alert('123');
            //document.organization = CommonFunctions.getReferenceOnSupplier(this.props.navigation.getParam('document').organization, global.organizations);
            document.supplier = CommonFunctions.getReferenceOnSupplier(this.props.navigation.getParam('document').supplier, global.suppliers);
           // Alert.alert('', JSON.stringify(this.props.navigation.getParam('document').supplier) );

        }

        this.setState(document || this.DEF_STATE);


//Alert.alert('', JSON.stringify(this.props.navigation.getParam('document')) );
        this.IS_NEW = !this.props.navigation.getParam('document');

        BackHandler.addEventListener('hardwareBackPress', this._goBack);
    }

    _prepareToSend() {
        console.log(this.state.items);
        return {
            supplier: this.state.supplier.guid,
            id: this.state.id,
            date: this.state.date,
            shipment: tomorrow,
            items: this.state.items,
            comment: this.state.comment,
        };
    }

    

    renderGoodItem = itemRow => {

        return (
            <TouchableOpacity
            style={{ flexDirection: 'row', backgroundColor: '#fff' }}
                onPress={() => {
                    if (!this.disabled) {
                        this.setState({ item: itemRow.item, itemView: itemRow.item.name });
                        this.askQuantity(true);
                    }
                }}
                onLongPress={() => {
                    if (!this.disabled) {
                        this.setState({
                            item: itemRow.item,
                            itemView: itemRow.item.name,
                            askDeleteVisible: true,
                        });
                    }
                }}
            >
                <Text numberOfLines={2} style={styles.item33}>{itemRow.item.name}</Text>
                <Text
                    style={styles.itemC}>{itemRow.item.quantity + ' ' + itemRow.item.unit_name + '. \n' + Number.parseFloat(itemRow.item.price).toFixed(2) + ' ₽'}&gt;</Text>
            </TouchableOpacity>

        );
    };

    askQuantity() {

    }

    onChange(item) {
        let newlist = JSON.parse(JSON.stringify(this.state.items));
        console.log(item);
        newlist.push({
            id: item.guid,
            name: item.name,
            quantity: item.quantity,
            unit_id: item.unitId,
            unit_name: item.unitName,
            price: 55,
        });
        this.setState({ items: newlist });
    }

    createPurchase() {
        this.setState({ dialog_createPurchase: false });
        let purchase = {
            id: CommonFunctions.getDocumentID('P'),
            status: 'draft',
            date: new Date(),
            supplier: JSON.parse(JSON.stringify(this.state.supplier)),
            parent: this.state.id,
            organization: this.state.organization,
            items: this.state.items,
            comment: '',
            totalSum: 0,
            scanVisible: false,
            allowedAccept: true,
            refUPD: this.state.refUPD,
        };
        console.log(JSON.stringify(purchase));
        this.props.navigation.navigate('PurchaseDetails', { document: purchase });
    }

    _getHeader() {
        console.log(this.IS_NEW);
        return (
            <AppHeader
                navigation={this.props.navigation}
                leftIcon="arrow-back"
                rightIcon={this.IS_NEW ? 'done' : 'forward'}
                title={this.TITLE}
                leftIconAction={this._goBack}
                rightIconAction={this.IS_NEW ? this._save : () => this.setState({ dialog_createPurchase: true })}
            />
        );
    }

    getDialogCreatePurchase() {
         if (this.state.allowedAccept <= false) {
            return Alert.alert('Нельзя провести заказ');
            //return Alert.alert('Нельзя провести заказ',JSON.stringify(this.props.navigation.getParam('document').allowedAccept));
         } else { 
        return (
            <PopupDialog
                visible={this.state.dialog_createPurchase}
                onTouchOutside={() => {
                    this.setState({ dialog_createPurchase: false });
                }}
                footer={
                    <DialogFooter style={{ flexDirection: 'row' }}>
                        <DialogButton
                            text="Отмена"
                            onPress={() => {
                                this.setState({ dialog_createPurchase: false });
                            }}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => {
                                this.createPurchase();
                            }}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title={'Создать ПТУ на основании?'}
                />
            </PopupDialog>
        );}
    }

    _getBody() {
       // Alert.alert('', JSON.stringify(this.state.supplier));
       
        return (
            <ScrollView style={styles.container}>
                <DatePicker
                    value={this.state.date}// изменение даты 
                    value1={this.state.shipment}
                    disabled={this.disabled}
                    onChange={(date) => this.setState({ date: date })}
                />

                <DropdownPicker
                    disabled={this.disabled}
                    title="Организация"
                    items={global.organizations}
                    value={this.state.organization}
                    onChange={(value) => this.setState({ organization: value })}
                />

                <DropdownPicker
                    disabled={this.disabled}
                    title="Поставщик"
                    items={global.suppliers}
                    value={this.state.supplier}
                    onChange={(value) => this.setState({ supplier: value })}
                />

                {global.storages.length > 1 &&
                <DropdownPicker
                    disabled={this.disabled}
                    title="Склад"
                    items={global.storages}
                    value={this.state.storage}
                    onChange={(value) => this.setState({ storage: value })}
                    />
                }

                <Text style={styles.label}>Номенклатура!</Text>

                {!this.state.items.length ? <Text style={styles.item}>&lt;Добавьте товары&gt; </Text> : null}

                <FlatList
                    style={{ backgroundColor: '#fff' }}
                    data={this.state.items}
                    renderItem={this.renderGoodItem}
                />

                {!this.disabled &&  /*+Добавить Номенклатуру*/ 
                <SupplierGoodsPicker
                    disabled={this.disabled}
                    goods={this.state.items}
                    supplier={this.state.supplier}
                    onChange={(item) => this.onChange(item)}
                    /> 
                }

                <RetailComment
                    disabled={this.state.status !== 'new' && this.state.status !== 'draft'}
                    value={this.state.comment}
                    onChange={(value) => {
                        this.setState({ comment: value });
                    }}
                />
                <Text style={{ padding: 8 }}>Итого: {this.state.totalSum} ₽</Text>
                
                <Button
                    onPress={() => this.setDataDelay()}
                    buttonStyle={styles.saveBtn33}
                    icon={{ name: 'add', color: '#fff'}}                    
                    title="Просрочено"   
                />

                <Button
                    onPress={() => this.setDeliveryArrived()}
                    buttonStyle={styles.saveBtn}
                    icon={{ name: 'add', color: '#ccff00'}}                    
                    title="Поставка Пришла"   
                />

                {!this.disabled && /*+Добавить Номенклатуру*/ 
                <OverdueOrderCollector
                    disabled={this.disabled}
                    goods={this.state.items}
                    supplier={this.state.supplier}
                    onChange={(item) => this.onChange(item)}
                />
                }
                <DialogProcess
                    visible={this.state.processing}
                />

                {this.getDialogCreatePurchase()}

            </ScrollView>
        );
    }
    
    setDataDelay() {
       
        let d = new Date();
        let data = {
            dateOf: d.toISOString(),
            parent: this.state.id,
            data: this.state.date
        }
        console.log(data);
        MobidServer1C.fetch('DeliveriesDateON', data)
            .then(result => {
                console.log(result);
                Alert.alert('', 'Успешно выполнено');
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('', 'Успешно выполнено');
            });
    }
    
    setDeliveryArrived() {
       
        let d = new Date();
        let data = {
            dateOf: d.toISOString(),
            parent: this.state.id,
            data: this.state.date
        }
        console.log(data);
        MobidServer1C.fetch('DeliveryArrived', data)
            .then(result => {
                console.log(result);
                Alert.alert('', 'Успешно выполнено');
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('', 'Ошибка');
            });
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
        margin: 30,
        
        
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
});

export default ExternalOrderDetails;
