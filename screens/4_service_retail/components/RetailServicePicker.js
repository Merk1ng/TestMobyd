import React from 'react';
import {StyleSheet, Text, FlatList, View, Dimensions, Modal, TextInput} from 'react-native';
import {ListItem, SearchBar, Divider, Button} from 'react-native-elements';
import Dialog, {DialogContent, DialogTitle, DialogFooter, DialogButton} from 'react-native-popup-dialog';

export class RetailServicePicker extends React.Component {

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
            orderNum: '',

        };
    }

    select(good) {
        this.setState({
            showModalPicker: false,
            dialog_quantity: true,

            id: good.id,
            name: good.name,
            quantity: '1',
            price: good.price,
            orderNum: good.orderNum,
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
            val.orderNum = this.state.orderNum || 'Без номера';
        } else {
            cloned.push({
                id: this.state.id,
                name: this.state.name,
                price: this.state.price,
                quantity: this.state.quantity,
                orderNum: this.state.orderNum || 'Без номера',
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

    SearchFilterFunction = text => {
        if (!text) {
            this.setState({
                displayGoods: global.goods,
                text: '',
            });
            return;
        }

        let searchArr = text.split(' ');

        let arr = global.goods.map((i) => {return i});

        for (let i = 0; i < searchArr.length; i++) {
            arr = arr.filter(function (item) {
                return item.name.toUpperCase().indexOf(searchArr[i].toUpperCase()) > -1;
            });
        }

        this.setState({displayGoods: arr, text: text});

        if (!Array.isArray(this.state.displayGoods) || this.state.displayGoods.length === 0) {
            this.setState({showAddButton: true});
            console.log('should be displayed')
        } else {
            this.setState({showAddButton: false});
        }
    };

    renderItem = (rowData, index) => {

        let item = rowData.item;

        return (
            <ListItem
                key={index}
                title={item.orderNum}
                subtitle={item.name}
                rightTitle={''}
                rightSubtitle={item.quantity}
                onPress={() => this.select(rowData.item)}
                onLongPress={() => {
                    this.setState({askDeleteVisible: true, currindex: index, itemname: item.name});
                }}
            />
        );
    };

    renderItemMod = (rowData, index) => {
        return (
            <ListItem
                title={rowData.item.name}
                subtitle={rowData.item.price}
                onPress={() => this.select(rowData.item)}/>
        );
    };

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
                            text="Cancel"
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
                    <TextInput
                        placeholder={'Номер заявки'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.orderNum}
                        onChangeText={(text) => this.setState({orderNum: text})}/>
                    <Divider/>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.quantity}
                        onChangeText={(text) => this.setState({quantity: text})}/>

                </DialogContent>
            </Dialog>
        );
    }

    getDialogDeleteItem() {
        return (
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
                }>
                <DialogTitle
                    title="Удалить текущий элемент?"
                />
                <DialogContent>
                    <Text style={{color: '#789'}}>{this.state.itemname}</Text>
                </DialogContent>
            </Dialog>
        );
    }

    render() {

        const {text} = this.state;

        return (
            <View style={[{backgroundColor: '#fff'}]}>
                <Text style={styles.label}>Услуги</Text>
                {!this.props.value.length ? <Text style={styles.item}>&lt;Добавьте услуги> </Text> : null}

                <FlatList
                    data={this.props.value}
                    renderItem={this.renderItem}
                />

                <Button
                    onPress={() => this.setState({showModalPicker: true})}
                    buttonStyle={styles.addBtn}
                    icon={{name: 'add', color: '#fff'}}
                    title="Добавить услугу"
                />

                <Divider/>

                {this.getDialogQuantity()}

                {this.getDialogDeleteItem()}


                <Modal
                    style={{zIndex: 1000}}
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModalPicker}
                    onRequestClose={() => this.setState({showModalPicker: false})}>

                    <View style={styles.viewStyle}>
                        <SearchBar
                            round
                            value={text}
                            searchIcon={{size: 24}}
                            onChangeText={this.SearchFilterFunction}
                            onClear={this.SearchFilterFunction}
                            placeholder="Type Here..."
                        />

                        <FlatList
                            data={this.state.displayGoods}
                            renderItem={this.renderItemMod}
                            enableEmptySections={true}
                            style={{marginTop: 10}}
                        />

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
        width: (Dimensions.get('window').width * 0.8),
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
        width: Dimensions.get('window').width * 0.2,
        right: 5,
        position: 'absolute',
    },
    label: {
        marginTop: 5,
        color: '#89a',
        left: 15,
    },
    addBtn: {
        margin: 10,
    },
});
