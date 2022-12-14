import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Dimensions, Modal, FlatList, TextInput} from 'react-native';
import {ListItem, SearchBar, Divider, Button} from 'react-native-elements';
import Dialog, {DialogContent, DialogTitle, DialogFooter, DialogButton} from 'react-native-popup-dialog';

export class ServicePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialog_quantity: false,
            showModalPicker: false,

            displayGoods: JSON.parse(JSON.stringify(global.goods)), // список отфильтрованных пользователем товаров в ModalPicker
            pickedGoods: this.props.value || [],                    // список выбранных пользователем товаров

            id: '',
            name: '',
            quantity: 1,
        };
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

    select(good) {

        this.state.services.forEach(item2 => {
            if (good.guid === item2.guid) {
                good = item2;
            }
        });

        this.setState({item: good, itemView: good.name});
        this.askQuantity(true);
        this.setModalVisible(false);

        setTimeout(() => {
            this.refs.textInputQuantity.focus();
        }, 300);
    }

    confirm() {
        let cloned = JSON.parse(JSON.stringify(this.props.value));

        let val = cloned.find(item => {
            return item.id === this.state.id;
        });

        if (val) {
            val.id = this.state.id;
            val.name = this.state.name;
            val.quantity = this.state.quantity;
        } else {
            cloned.push({
                id: this.state.id,
                name: this.state.name,
                quantity: this.state.quantity,
            });
        }

        this.setState({
            dialog_quantity: false,
            text: '',
        });

        this.props.onChange(cloned);

        if (this.state.quantity === '0') {

        }
    }

    askQuantity(val) {
        this.setState({askQuantityVisiblity: val});
    }

    renderItem = (rowData) => {

        let item = rowData.item;

        return (
            <ListItem
                title={item.name}
                subtitle={item.price}
                onPress={() => {
                    this.setState({
                        showModalPicker: false,
                        dialog_quantity: true,

                        id: item.id,
                        name: item.name,
                        quantity: '1'
                    });
                }}
            />
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
                        ref={'textInputQuantity'}
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.quantity}
                        onChangeText={(text) => this.setState({quantity: text})}
                    />
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
                    renderItem={({item}) =>
                        <TouchableOpacity
                            style={{flexDirection: 'row', flex: 1}}
                            onPress={() => {
                                this.setState({item: item, itemView: item.name});
                                this.askQuantity(true);
                            }}>

                            <Text style={styles.item}>
                                {item.name}{'\n'}{'\n'}
                            </Text>

                            <Text style={styles.itemC}>
                                {item.quantity} шт.
                            </Text>
                        </TouchableOpacity>}
                />

                <Button
                    onPress={() => this.setState({showModalPicker: true})}
                    buttonStyle={styles.addBtn}
                    icon={{name: 'add', color: '#fff'}}
                    title="Добавить услугу"
                />

                <Divider/>

                {this.getDialogQuantity()}

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
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
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
