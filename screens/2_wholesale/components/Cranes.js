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
    Alert, ScrollView,
} from 'react-native';
import {ListItem, FormLabel, Icon, SearchBar, Divider, Button} from 'react-native-elements';
import Dialog, {DialogContent, DialogFooter, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import ModalPicker from '../../../components/ModalPicker';
import CommonFunctions from '../../../helpers/CommonFunctions';

export class Cranes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            /* Видимость управляющих элементов */
            dialog_quantity: false,
            dialog_newGood: false,
            dialog_delete: false,
            showModalPicker: false,
            showAddGoodButton: false,

            /* Надписи на управляющих элементах */
            dialog_title: '',

            displayGoods: JSON.parse(JSON.stringify(global.goods)), // список отфильтрованных пользователем товаров в ModalPicker
            pickedGoods: this.props.value || [],                    // список выбранных пользователем товаров

            /* Свойства крана, над которым производится текущее действие */
            id: '',
            name: '',
            quantity: '1',
            price: '',

        };
    }

    select(good) {
        this.setState({
            showModalPicker: false,
            dialog_quantity: true,

            id: good.id,
            name: good.name,
            quantity: '1',
            price: '',
        });
    }

    confirm() {

        let cloned = JSON.parse(JSON.stringify(this.props.value));

        let val = cloned.find(item => {
            return item.id === this.state.id;
        });

        if (val) {
            val.id = this.state.id;
            val.name = this.state.name;
            val.price = this.state.price;
            val.quantity = this.state.quantity;
        } else {
            cloned.push({
                id: this.state.id,
                name: this.state.name,
                price: this.state.price,
                quantity: this.state.quantity,
            });
        }

        this.setState({
            dialog_quantity: false,
            dialog_newGood: false,
            text: '',
        });

        this.props.onChange(cloned);

        if (this.state.quantity === '0') {
            this.delete();
        }
    }

    delete() {
        let filtered = JSON.parse(JSON.stringify(this.props.value)).filter(item => {
            return item.id !== this.state.id;
        });
        this.setState({
            dialog_delete: false,
        });
        this.props.onChange(filtered);
    }

    getDialogQuantity() {
        return (
            <Dialog
                width={0.9}
                visible={this.state.dialog_quantity}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Отмена"
                            onPress={() => this.setState({dialog_quantity: false})}
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
                    <Text style={{color: '#789'}}>Количество</Text>
                    <TextInput
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.quantity}
                        onChangeText={(text) => this.setState({quantity: text})}
                    />
                    <Divider/>
                    <Text style={{color: '#789'}}>Цена</Text>
                    <TextInput
                        placeholder={'Введите цену'}
                        editable={true}
                        keyboardType={'numeric'}
                        autoFocus={true}
                        value={this.state.price}
                        onChangeText={(text) => this.setState({price: text})}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    getDialogNewGood() {
        return (
            <Dialog
                visible={this.state.dialog_newGood}
                onTouchOutside={() => {
                    this.setState({dialog_newGood: false});
                }}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Отмена"
                            onPress={() => {
                                this.setState({dialog_newGood: false});
                            }}
                        />
                        <DialogButton
                            text="Готово"
                            onPress={() => this.confirm()}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title="Создание нового вида товара"
                />
                <DialogContent>
                    <Text style={{color: '#789'}}>Наименование</Text>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Введите наименование'}
                        editable={true}
                        value={this.state.name}
                        onChangeText={(text) => {
                            this.setState({name: text});
                        }}/>
                    <Divider/>
                    <Text style={{color: '#789'}}>Количество</Text>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.quantity}
                        onChangeText={(text) => this.setState({quantity: text})}/>
                    <Divider/>
                    <Text style={{color: '#789'}}>Цена</Text>
                    <TextInput
                        placeholder={'Введите цену'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.price}
                        onChangeText={(text) => this.setState({price: text})}/>
                </DialogContent>
            </Dialog>
        );
    }

    getDialogDeleteItem() {
        return (
            <Dialog
                visible={this.state.dialog_delete}
                onTouchOutside={() => this.setState({dialog_delete: false})}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Нет"
                            onPress={() => {
                                this.setState({dialog_delete: false});
                            }}
                        />
                        <DialogButton
                            text="Да"
                            onPress={() => {
                                setTimeout(() => {
                                    this.props.onChange(this.state.services);
                                }, 300);
                                this.setState({askDeleteVisible: false});
                            }}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title="Удалить текущий элемент?"
                />
                <DialogContent>
                    <Text style={{color: '#789'}}>{this.state.itemView}</Text>
                </DialogContent>
            </Dialog>
        );
    }

    renderItem = (rowData) => {
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
            >
                <Text
                    numberOfLines={2}
                    style={styles.item}>{item.name}
                </Text>
                <Text
                    style={styles.itemC}>{item.quantity}шт. {item.price}р.
                </Text>

            </TouchableOpacity>
        );
    };

    SearchFilterFunction = text => {
        if (!text) {
            this.setState({
                displayGoods: global.goods,
                text: '',
            });
            return;
        }

        let searchArr = text.split(' ');

        let arr = global.goods.map((i) => {
            return i;
        });

        for (let i = 0; i < searchArr.length; i++) {
            arr = arr.filter(function (item) {
                return item.name.toUpperCase().indexOf(searchArr[i].toUpperCase()) > -1;
            });
        }

        this.setState({displayGoods: arr, text: text});

        if (!Array.isArray(this.state.displayGoods) || this.state.displayGoods.length === 0) {
            this.setState({showAddButton: true});
            console.log('should be displayed');
        } else {
            this.setState({showAddButton: false});
        }
    };

    render() {
        const {text} = this.state;
        return (
            <View style={[{backgroundColor: '#fff'}]}>

                <Text style={styles.label}>Номенклатура</Text>
                {!this.props.value.length ? <Text style={styles.item}>&lt;Добавьте товары> </Text> : null}

                <FlatList
                    data={this.props.value}
                    renderItem={this.renderItem}
                />

                <Button
                    onPress={() => this.setState({showModalPicker: true})}
                    buttonStyle={styles.saveBtn}
                    icon={{name: 'add', color: '#fff'}}
                    title="Добавить номенклатуру"
                />
                <Divider/>

                {this.getDialogQuantity()}
                {this.getDialogNewGood()}
                {this.getDialogDeleteItem()}

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModalPicker}
                    onRequestClose={() => this.setState({showModalPicker: false})}>
                    <View style={styles.viewStyle}>
                        <SearchBar
                            autoFocus={true}
                            round
                            value={text}
                            clearIcon={{size: 34}}
                            searchIcon={{size: 24}}
                            onChangeText={this.SearchFilterFunction}
                            onClear={this.SearchFilterFunction}
                            placeholder="Type Here..."
                        />
                        <FlatList
                            data={this.state.displayGoods}
                            renderItem={rowData => (
                                <ListItem
                                    title={rowData.item.name}
                                    onPress={() => {
                                        this.select(rowData.item);
                                    }}
                                />
                            )}
                            enableEmptySections={true}
                            style={{marginTop: 10}}
                        />
                        {this.state.showAddButton &&
                        <Button
                            onPress={() => {
                                this.setState({
                                    dialog_newGood: true,
                                    showModalPicker: false,
                                    name: this.state.text,
                                    id: CommonFunctions.getDocumentID('NGOOD'),
                                    price: 0,
                                    quantity: 0,
                                });

                            }}
                            icon={{name: 'add', color: '#fff'}}
                            buttonStyle={styles.saveBtn}
                            title="Новый товар"
                        />
                        }

                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        width: (Dimensions.get('window').width * 0.75),
        paddingLeft: 15,
        height: 43,
        justifyContent: 'space-between',
    },
    itemC: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        paddingLeft: 15,
        height: 43,
        width: Dimensions.get('window').width * 0.25,
        right: 5,
        position: 'absolute',
    },
    saveBtn: {
        margin: 10,
    },
    label: {
        marginTop: 5,
        color: '#89a',
        left: 15,
    },
    actionBtn: {
        margin: 10,
    },
    cancelButton: {
        backgroundColor: '#fff',
        width: 40,
    },
});

export default Cranes;
