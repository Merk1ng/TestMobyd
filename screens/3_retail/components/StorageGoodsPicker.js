import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Dimensions, Modal, FlatList, TextInput, Picker} from 'react-native';
import {ListItem, Icon, SearchBar, Divider, Button} from 'react-native-elements';
import Dialog, {DialogContent, DialogFooter, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import {BarcodeScanner} from '../../../components/BarcodeScanner';
import CommonFunctions from '../../../helpers/CommonFunctions';

export class StorageGoodsPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            breadcrumbs: [],

            /* Видимость управляющих элементов */
            dialog_quantity: false,
            dialog_delete: false,
            showModalPicker: false,
            showScanner: false,

            /* Надписи на управляющих элементах */
            dialog_title: '',

            displayGoods: JSON.parse(JSON.stringify(global.hgoods)), // список отфильтрованных пользователем товаров в ModalPicker
            pickedGoods: this.props.value || [],                    // список выбранных пользователем товаров

            /* Свойства крана, над которым производится текущее действие */
            id: '',
            name: '',
            quantity: '1',
            storage: '',
            unit_name: '',
            unit_id: '',
            measurement: null,
        };
    }

    SearchFilterFunction = text => {
        if (!text) {
            this.setState({
                displayGoods: global.hgoods,
                text: '',
            });
            return;
        }

        let arr = global.goods.filter(function (item) {
            return item.name.toUpperCase().match(text.toUpperCase());
        });
        this.setState({displayGoods: arr, text: text});
    };

    clickItem(good) {

        let backLabel = '⬅ Назад';

        // Движение по иерархии товаров в глубину.
        if (good.items) {
            this.setState({
                breadcrumbs: this.state.breadcrumbs.concat([JSON.parse(JSON.stringify(this.state.displayGoods))]),
                displayGoods: [{name: backLabel}].concat(good.items),
            });
            return;
        }

        // Движение по иерархии товаров назад.
        if (good.name === backLabel) {
            let nbc = JSON.parse(JSON.stringify(this.state.breadcrumbs));
            --nbc.length;
            this.setState({displayGoods: this.state.breadcrumbs[this.state.breadcrumbs.length - 1], breadcrumbs: nbc});
            return;
        }

        // Выбор товара

        this.setState({
            showModalPicker: false,
            dialog_quantity: true,

            text: '',

            id: good.id,
            name: good.name,
            quantity: '1',
            unit: good.measurement[0],
            unit_id: good.measurement[0].id,
            unit_name: good.measurement[0].name,
            unit_ratio: good.measurement[0].ratio,
            measurement: good.measurement,

        });
    }

    _keyExtractor = (item, index) => item.guid;

    findGoodByBarcode(value) {
        let finded = [];
        if (Array.isArray(value)) {
            value.forEach(scanned => {
                global.barcodes.forEach(current => {
                    if (current.barcode === scanned.data) {
                        this.clickItem(CommonFunctions.getReference(current, global.goods));
                        this.setState({barcodeScannerVisible: false});
                    }
                });
            });
        }
    }

    toggleCollapse(name) {
        console.warn(name);
    }

    askQuantity(val) {
        if (this.state.item && !this.state.item.measurement) {
            this.setState({item: CommonFunctions.getReference(this.state.item, this.state.dataSource)});
        }
        this.setState({dialog_quantity: val});
    }

    deleteItem() {

        let cloned = JSON.parse(JSON.stringify(this.props.value)).filter(item => {
            return item.id !== this.state.id;
        });

        this.setState({
            dialog_delete: false,
            text: '',
        });

        this.props.onChange(cloned);
    }

    confirm() {

        let cloned = JSON.parse(JSON.stringify(this.props.value));

        let val = cloned.find(item => {
            return item.id === this.state.id;
        });

        if (val) {
            val.id = this.state.id;
            val.name = this.state.name;
            val.unit = this.state.unit;
            val.quantity = this.state.quantity;
        } else {
            cloned.push({
                id: this.state.id,
                name: this.state.name,
                unit: this.state.unit,
                unit_id: this.state.unit_id,
                quantity: this.state.quantity,
            });
        }

        this.setState({
            dialog_quantity: false,
            text: '',
        });

        this.props.onChange(cloned);
    }

    getDialogQuantity() {
        return (
            <Dialog
                width={0.9}
                visible={this.state.dialog_quantity}
                onTouchOutside={() => {
                    this.setState({dialog_quantity: false});
                }}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Отмена"
                            onPress={() => {
                                this.setState({dialog_quantity: false});
                            }}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => this.confirm()}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title={this.state.name}
                />
                <DialogContent>
                    <Text style={styles.dialogLabel}>Количество</Text>
                    <TextInput
                        autoFocus={true}
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.quantity}
                        onChangeText={(text) => this.setState({quantity: text})}
                        
                    />
                    <Divider/>
                    {/* <Text style={styles.dialogLabel}>Ед. измерения </Text>

                    <Picker mode={'dropdown'}
                            >

                        {this.state.measurement && this.state.measurement.map((i, index) => (
                            <Picker.Item key={index} label={i.name + ' (кратн. ' + i.ratio + ')'} value={i}/>
                        ))}
                    </Picker> */}
                </DialogContent>
            </Dialog>
        );
    }

    getDialogDeleteItem() {
        return (
            <Dialog
                visible={this.state.dialog_delete}
                onTouchOutside={() => {
                    this.setState({dialog_delete: false});
                }}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Да"
                            onPress={() => {
                                this.deleteItem();
                            }}
                        />
                        <DialogButton
                            text="Нет"
                            onPress={() => {
                                this.setState({dialog_delete: false});
                            }}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title="Удалить текущий элемент?"
                />
                <DialogContent>
                    <Text style={{color: '#789'}}>{this.state.name}</Text>
                </DialogContent>
            </Dialog>
        );
    }

    renderGoodItem = (rowData) => {
        let item = rowData.item;
        return (
            <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                    this.setState({
                        dialog_quantity: true,
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    });
                }}
                onLongPress={() => {
                    this.setState({
                        dialog_delete: true,
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    });
                }}
            >
                <Text
                    numberOfLines={2}
                    style={styles.item}>{item.name}
                </Text>
                <Text
                    style={styles.itemC}>{item.quantity} ш.{item.price} р.
                </Text>

            </TouchableOpacity>
        );
    };

    render() {
        const {text} = this.state;

        return (

            <View style={[{backgroundColor: '#fff'}]}>

                <Text style={styles.label}>Номенклатура</Text>
                {!this.props.value.length ? <Text style={styles.item}>&lt;Добавьте товары </Text> : null}
                <FlatList
                    data={this.props.value}
                    renderItem={this.renderGoodItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                {this.props.draft &&
                <Button
                    onPress={() => {
                        this.setState({showModalPicker: true});
                    }}
                    buttonStyle={styles.saveBtn}
                    icon={{name: 'add', color: '#fff'}}
                    title="Добавить номенклатуру"
                />
                }
                <Divider/>

                {this.getDialogQuantity()}
                {this.getDialogDeleteItem()}

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModalPicker}
                    onRequestClose={() => {
                        this.setState({showModalPicker: false});
                    }}>
                    <View style={styles.viewStyle}>
                        <SearchBar
                            round
                            value={text}
                            searchIcon={
                                <Icon
                                    type='material-community'
                                    name="barcode-scan"
                                    color="white"
                                    onPress={() => this.setState({showScanner: true})}
                                />
                            }
                            clearIcon={{size:34}}
                            onChangeText={this.SearchFilterFunction}
                            onClear={this.SearchFilterFunction}
                            placeholder="Type Here..."
                        />

                        <FlatList
                            data={this.state.displayGoods}
                            keyExtractor={this._keyExtractor}
                            renderItem={(rowData, index) => (
                                <ListItem
                                    key={index}
                                    leftIcon={rowData.item.items ? {name: 'folder'} : null}
                                    title={rowData.item.name}
                                    onPress={() => {
                                        this.clickItem(rowData.item);
                                    }}
                                />
                            )}
                            enableEmptySections={true}
                            style={{marginTop: 10}}
                        />
                    </View>
                </Modal>

                <BarcodeScanner
                    visible={this.state.showScanner}
                    onChange={(value) => {
                        this.findGoodByBarcode(value);
                    }}
                    onCancel={() => {
                        this.setState({showScanner: false});
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        width: (Dimensions.get('window').width * 0.8),
        paddingLeft: 8,
        height: 43,
        justifyContent: 'space-between',
    },
    item222: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        width: (Dimensions.get('window').width * 0.8),
        paddingLeft: 8,
        height: 43,
        textDecorationLine: 'line-through',
        justifyContent: 'space-between',
    },
    itemC: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        textAlign: 'right',
        paddingLeft: 15,
        height: 43,
        width: Dimensions.get('window').width * 0.2,
        right: 5,
        position: 'absolute',
    },
    itemGroup: {
        width: (Dimensions.get('window').width * 0.85),
        paddingLeft: 8,
        height: 32,
        justifyContent: 'space-between',
        padding: 5,
        color: '#458',
        backgroundColor: '#efefef',
        fontSize: 16,

    },
    itemGroupIcon: {
        width: (Dimensions.get('window').width * 0.15),
        paddingLeft: 0,
        height: 32,
        justifyContent: 'space-between',
        color: '#456',
        backgroundColor: '#eee',
        fontSize: 28,

    },
    saveBtn: {
        margin: 10,
    },
    label: {
        marginTop: 5,
        color: '#89a',
        left: 8,
    },
    actionBtn: {
        margin: 10,
    },
    dialogLabel: {
        color: '#789',
    },
});

export default StorageGoodsPicker;


/*
componentWillReceiveProps({someProp}) {

setTimeout(() => {
let propsValue = [];
if (this.props.value.length > 10) {
let isFinded = false;
this.props.value.forEach(item => {
if (item.type === "Разливное пиво") {
isFinded = true;
}
});

if (isFinded)
propsValue.push({
name: "Разливное пиво",
measure: {guid: "", name: ""},
quantity: null,
status: "group"
});

this.props.value.forEach(item => {
if (item.type === "Разливное пиво") {
propsValue.push(item);
}
});


isFinded = false;
this.props.value.forEach(item => {
if (item.type === "Бутылочное пиво") {
isFinded = true;
}
});

if (isFinded)
propsValue.push({
name: "Бутылочное пиво",
measure: {guid: "", name: ""},
quantity: null,
status: "group"
});
this.props.value.forEach(item => {
if (item.type === "Бутылочное пиво") {
propsValue.push(item);
}
});

isFinded = false;
this.props.value.forEach(item => {
if (item.type === "Весовые снеки") {
isFinded = true;
}
});
if (isFinded)
propsValue.push({
name: "Весовые снеки",
measure: {guid: "", name: ""},
quantity: null,
status: "group"
});
this.props.value.forEach(item => {
if (item.type === "Весовые снеки") {
propsValue.push(item);
}
});

isFinded = false;
this.props.value.forEach(item => {
if (item.type === "Фасованные снеки") {
isFinded = true;
}
});
if (isFinded)
propsValue.push({
name: "Фасованные снеки",
measure: {guid: "", name: ""},
quantity: null,
status: "group"
});
this.props.value.forEach(item => {
if (item.type === "Фасованные снеки") {
propsValue.push(item);
}
});

isFinded = false;
this.props.value.forEach(item => {
if (item.type === "Сигареты") {
isFinded = true;
}
});

if (isFinded)
propsValue.push({name: "Сигареты", measure: {guid: "", name: ""}, quantity: null, status: "group"});
this.props.value.forEach(item => {
if (item.type === "Сигареты") {
propsValue.push(item);
}
});

isFinded = false;
this.props.value.forEach(item => {
if (item.type === "Прочее") {
isFinded = true;
}
});

if (isFinded)
propsValue.push({name: "Прочее", measure: {guid: "", name: ""}, quantity: null, status: "group"});
this.props.value.forEach(item => {
if (item.type === "Прочее") {
propsValue.push(item);
}
});

} else {
propsValue = this.props.value;
}

this.setState({goods: propsValue});

}, 0);
}
*/
