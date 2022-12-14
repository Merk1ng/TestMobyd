import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
    Modal,
    FlatList,
    TextInput,
} from 'react-native';
import {
    ListItem,
    Icon,
    SearchBar,
    Divider,
    Button,
} from 'react-native-elements';
import Dialog, {
    DialogContent,
    DialogFooter,
    DialogButton,
    DialogTitle,
} from 'react-native-popup-dialog';
import {BarcodeScanner} from '../../../components/BarcodeScanner';

export class InventoryGoodsPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            /* Видимость управляющих элементов */
            dialog_quantity: false,
            dialog_delete: false,
            showModalPicker: false,
            showScanner: false,

            /* Надписи на управляющих элементах */
            dialog_title: '',

            displayGoods: JSON.parse(JSON.stringify(global.inventory)), // список отфильтрованных пользователем товаров в ModalPicker
            pickedGoods: this.props.value || [], // список выбранных пользователем товаров

            /* Свойства крана, над которым производится текущее действие */
            id: '',
            name: '',
            quantity: '1',
            unit_name: '',
            unit_id: '',
            measurement: null,
        };
    }

    SearchFilterFunction = text => {
        if (!text) {
            this.setState({
                displayGoods: global.inventory,
                text: '',
            });
            return;
        }

        let arr = global.inventory.filter(function (item) {
            return item.name.toUpperCase().match(text.toUpperCase());
        });
        this.setState({displayGoods: arr, text: text});
    };

    clickItem(good) {
        console.log(good);
        this.setState({
            id: good.id,
            name: good.name,
            quantity: good.quantity,
            itemView: good.name,
            text: '',
            dialog_quantity: true,
            showModalPicker: false,
        });
    }

    setQuantity(inputText) {
        this.state.item.quantityPrev = this.state.item.quantity;
        this.state.item.quantity = inputText;
    }

    confirm() {
        console.log(this.props.value);

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

    findGoodByBarcode(value) {
        let finded = [];
        if (Array.isArray(value)) {
            value.forEach(scanned => {
                global.barcodes.forEach(current => {
                    if (current.barcode === scanned.data) {
                        // this.clickItem(Functions.getReference(current, global.inventory));
                        this.setState({barcodeScannerVisible: false});
                    }
                });
            });
        }
    }

    deleteItem() {
        for (let i = 0; i < this.state.goods.length; i++) {
            if (this.state.goods[i] === this.state.item) {
                this.state.goods.splice(i, 1);
            }
        }
        setTimeout(() => {
            this.props.onChange(this.state.goods);
        }, 300);
        this.setState({askDeleteVisible: false});
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
                            onPress={() => this.setState({dialog_quantity: false})}
                        />
                        <DialogButton text="OK" onPress={() => this.confirm()}/>
                    </DialogFooter>
                }
            >
                <DialogTitle title={this.state.name}/>
                <DialogContent>
                    <Text style={styles.dialogLabel}>Количество</Text>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'decimal-pad'}
                        value={this.state.quantity}
                        onChangeText={text => this.setState({quantity: text})}
                    />
                    <Divider/>
                    <Text style={styles.dialogLabel}>Ед. измерения</Text>
                    <Text style={styles.dialogLabel}>{this.state.unit_name}</Text>
                </DialogContent>
            </Dialog>
        );
    }

    render() {
        const {text} = this.state;

        return (
            <View style={[{backgroundColor: '#fff'}]}>
                <Text style={styles.label}>Номенклатура</Text>

                {!this.props.value.length ? (
                    <Text style={styles.item}>&lt;Добавьте товары> </Text>
                ) : null}

                <FlatList
                    data={this.props.value}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() => {
                                this.setState({
                                   dialog_quantity: true,
                                   showModalPicker: false,
                                   dialog_title: item.name,
                                    id: item.id,
                                    name: item.name,
                                    quantity: item.quantity,
                                    unit_name: item.unit_name,
                                    unit_id: item.unit_id,
                                });
                            }}
                        >
                            <Text
                                numberOfLines={2}
                                style={!item.quantityPrev ? styles.item : styles.itemD}
                            >
                                {item.name}
                            </Text>

                            <Text style={!item.quantityPrev ? styles.itemC : styles.itemCD}>
                                {item.quantity}{' '}
                                {item.quantityPrev ? '(' + item.quantityPrev + ')' : ''}{' '}
                                {item.measure}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                {!this.props.disabled && (
                    <Button
                        onPress={() => {
                            this.setState({showModalPicker: true});
                        }}
                        buttonStyle={styles.saveBtn}
                        icon={{name: 'add', color: '#fff'}}
                        title="Добавить номенклатуру"
                    />
                )}
                <Divider/>

                {this.getDialogQuantity()}

                <Dialog
                    visible={this.state.askDeleteVisible}
                    onTouchOutside={() => {
                        this.setState({askDeleteVisible: false});
                    }}
                    footer={
                        <DialogFooter style={{flexDirection: 'row'}}>
                            <DialogButton
                                text="Нет"
                                onPress={() => {
                                    this.setState({askDeleteVisible: false});
                                }}
                            />
                            <DialogButton
                                text="Да"
                                onPress={() => {
                                    this.deleteItem();
                                }}
                            />
                        </DialogFooter>
                    }
                >
                    <DialogTitle title="Удалить текущий элемент?"/>
                    <DialogContent>
                        <Text style={{color: '#789'}}>{this.state.itemView}</Text>
                    </DialogContent>
                </Dialog>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModalPicker}
                    onRequestClose={() => {
                        this.setState({showModalPicker: false});
                    }}
                >
                    <View style={styles.viewStyle}>
                        <SearchBar
                            round
                            value={text}
                            searchIcon={
                                <Icon
                                    type="material-community"
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
                            renderItem={rowData => (
                                <ListItem
                                    title={rowData.item.name}
                                    badge={{
                                        value: rowData.item.quantity + ' ' + rowData.item.measure,
                                        textStyle: {color: 'white'},
                                        containerStyle: {marginTop: -20, padding: 10},
                                    }}
                                    onPress={() => this.clickItem(rowData.item)}
                                />
                            )}
                            enableEmptySections={true}
                            style={{marginTop: 10}}
                        />
                    </View>
                </Modal>
                <BarcodeScanner
                    visible={this.state.showScanner}
                    onChange={value => {
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
        width: Dimensions.get('window').width * 0.8,
        paddingLeft: 8,
        height: 43,
        justifyContent: 'space-between',
    },
    itemD: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        width: Dimensions.get('window').width * 0.8,
        paddingLeft: 8,
        height: 43,
        justifyContent: 'space-between',
        backgroundColor: '#afa',
    },
    item222: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        width: Dimensions.get('window').width * 0.8,
        paddingLeft: 8,
        height: 43,
        textDecorationLine: 'line-through',
        justifyContent: 'space-between',
    },
    itemC: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        paddingLeft: 5,
        height: 43,
        width: Dimensions.get('window').width * 0.2,
        right: 0,
        position: 'absolute',
    },
    itemCD: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        paddingLeft: 5,
        backgroundColor: '#afa',
        height: 43,
        width: Dimensions.get('window').width * 0.2,
        right: 0,
        position: 'absolute',
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

export default InventoryGoodsPicker;
