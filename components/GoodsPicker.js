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
import {ListItem, FormLabel, SearchBar, Divider, Button} from 'react-native-elements';
import Dialog, {DialogContent, DialogFooter, DialogButton, DialogTitle} from 'react-native-popup-dialog';

export class GoodsPicker extends React.Component {

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    SearchFilterFunction = text => {

        if (!text) {
            this.setState({
                dataSource: global.goods,
                text: '',
            });
            return;
        }

        let arr = global.goods.filter(function (item) {
            return item.name.toUpperCase().indexOf(text.toUpperCase()) > -1;
        });

        this.setState({dataSource: arr, text: text});

        if (!Array.isArray(this.state.dataSource) || this.state.dataSource.length === 0) {
            this.setState({showAddButton: true});
        } else {
            this.setState({showAddButton: false});
        }
    };

    _showServicePicker() {
        this.setState({modalVisible: true});
    }

    componentDidMount() {
        this.setState({
                isLoading: false,
                dataSource: global.goods,
            },
        );
    }

    componentWillReceiveProps({someProp}) {
        setTimeout(() => {
            this.setState({services: this.props.value});
        }, 50);
    }

    constructor(props) {
        super(props);

        this.state = {
            askQuantityVisiblity: false,
            newGoodDialogVisible: false,
            askDeleteVisible: false,
            showAddButton: false,
            modalVisible: false,
            dialog2visible: false,
            services: this.props.value ? this.props.value : [],
            item: null,
            itemView: '',
            editingItem: null,
        };
    }

    select(good) {
        this.setState({item: good, itemView: good.name, text: ''});
        this.askQuantity(true);
        this.setModalVisible(false);
    }

    setQuantity(inputText) {
        this.state.item.quantity = inputText;
    }

    setPrice(inputText) {
        this.state.item.price = inputText;
    }

    askQuantity(val) {
        this.setState({askQuantityVisiblity: val});
    }

    getDialogQuantity() {
        return (
            <Dialog
                visible={this.state.askQuantityVisiblity}
                onTouchOutside={() => {
                    this.setState({askQuantityVisiblity: false});
                }}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Отмена"
                            onPress={() => {
                                this.setState({askQuantityVisiblity: false});
                            }}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => {
                                let finded = false;
                                let findex;
                                for (let i = 0; i < this.state.services.length; i++) {
                                    if (this.state.services[i].guid === this.state.item.guid) {
                                        finded = true;
                                        findex = i;
                                    }
                                }
                                let newServ = this.state.services.slice();
                                if (!finded) {
                                    newServ = this.state.services.concat(this.state.item);
                                } else {
                                    newServ[findex].quantity = this.state.item.quantity;
                                }

                                this.setState({services: newServ});
                                setTimeout(() => {
                                    this.props.onChange(this.state.services);
                                }, 300);

                                this.askQuantity(false);
                            }}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title={this.state.itemView}
                />
                <DialogContent>
                    <Text style={{color: '#789'}}>Количество</Text>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.Total}
                        onChangeText={(text) => this.setQuantity(text, 2)}/>
                    <Divider/>
                    <Text style={{color: '#789'}}>Цена</Text>
                    <TextInput
                        placeholder={'Введите цену'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.Price}
                        onChangeText={(text) => this.setPrice(text, 2)}/>
                </DialogContent>
            </Dialog>
        );
    }

    getDialogNewGood() {
        return (
            <Dialog
                visible={this.state.newGoodDialogVisible}
                onTouchOutside={() => {
                    this.setState({newGoodDialogVisible: false});
                }}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Отмена"
                            onPress={() => {
                                this.setState({newGoodDialogVisible: false});
                            }}
                        />
                        <DialogButton
                            text="Готово"
                            onPress={() => {
                                this.state.item.name = this.state.itemView;
                                let newServ = this.state.services.concat(this.state.item);
                                this.setState({services: newServ});
                                setTimeout(() => {
                                    this.props.onChange(this.state.services);
                                }, 300);

                                this.askQuantity(false);
                                this.setState({newGoodDialogVisible: false});
                            }}
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
                        value={this.state.itemView}
                        onChangeText={(text) => {
                            this.setState({itemView: text});
                        }}/>
                    <Divider/>
                    <Text style={{color: '#789'}}>Количество</Text>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Введите количество'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.Total}
                        onChangeText={(text) => this.setQuantity(text, 2)}/>
                    <Divider/>
                    <Text style={{color: '#789'}}>Цена</Text>
                    <TextInput
                        placeholder={'Введите цену'}
                        editable={true}
                        keyboardType={'numeric'}
                        value={this.state.Price}
                        onChangeText={(text) => this.setPrice(text, 2)}/>
                </DialogContent>
            </Dialog>
        );
    }

    getDialogDeleteItem() {
        return (
            <Dialog
                visible={this.state.askDeleteVisible}
                onTouchOutside={() => {
                    console.log('vis');
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
                                this.setState({
                                    services: this.state.services.filter(item => {
                                        return item.guid !== this.state.item.guid;
                                    }),
                                });

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
        return (
            <TouchableOpacity style={{flexDirection: 'row'}}
                              onPress={() => {
                                  this.setState({item: rowData.item, itemView: rowData.item.name});
                                  this.askQuantity(true);
                              }}
                              onLongPress={() => {
                                  console.warn('ev');
                                  this.setState({
                                      item: rowData.item,
                                      itemView: rowData.item.name,
                                      askDeleteVisible: true,
                                  });
                              }}>
                <Text numberOfLines={2}
                      style={styles.item}>{rowData.item.name}
                </Text>
                <Text
                    style={styles.itemC}>{rowData.item.quantity}шт. {rowData.item.price}р.
                </Text>
            </TouchableOpacity>
        );
    };


    render() {
        const {text} = this.state;
        return (
            <View style={[{backgroundColor: '#fff'}]}>

                <Text style={styles.label}>Номенклатура</Text>
                {!this.state.services.length ? <Text style={styles.item}>&lt;Добавьте товары> </Text> : null}
                <FlatList
                    data={this.state.services}
                    renderItem={this.renderItem}
                />
                <Button
                    onPress={() => this._showServicePicker()}
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
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}>
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
                            data={this.state.dataSource}
                            renderItem={rowData => (
                                <ListItem
                                    title={rowData.item.name}
                                    onPress={() => {
                                        this.select(rowData.item);
                                    }}/>
                            )}
                            enableEmptySections={true}
                            style={{marginTop: 10}}
                        />
                        {this.state.showAddButton &&
                        <Button
                            onPress={() => {
                                this.setState({
                                    newGoodDialogVisible: true,
                                    modalVisible: false,
                                    itemView: this.state.text,
                                    item: {name: this.state.text, guid: 'newGood', price: 0, quantity: 0},
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
});

export default GoodsPicker;
