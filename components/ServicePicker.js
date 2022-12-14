import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
    Modal, FlatList, TextInput,
} from 'react-native';
import {
    ListItem,
    Input,
    FormLabel,
    SearchBar, Divider, Button,
} from 'react-native-elements';
import Dialog, {DialogContent, DialogTitle, DialogFooter, DialogButton} from 'react-native-popup-dialog';

export class ServicePicker extends React.Component {

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    SearchFilterFunction = text => {
        let newData = this.state.dataSourceFull.filter(function (item) {
            const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
            if (!text) {
                text = '';
            }
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        this.setState({
            dataSource: newData,
            text: text,
        });
    };

    _showServicePicker() {
        console.log(global.goods);
        this.setState({modalVisible: true});
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({dataSource: global.goods, dataSourceFull: global.goods});
        }, 150);
       /* let responseJson = global.goods;
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.setState({
                isLoading: false,
                dataSource: ds.cloneWithRows(responseJson),
            }, function () {
                this.arrayholder = responseJson;
            },
        );*/
    }

    componentWillReceiveProps({someProp}) {
        setTimeout(() => {
            if (this.props.value) {
                this.setState({
                    services: this.props.value,
                });
            } else {
                this.setState({
                    services: [],
                });
            }
        }, 150);



    }

    constructor(props) {
        super(props);

        if (this.props.value) {
            this.state = {
                askQuantityVisiblity: false,
                modalVisible: false,
                services: this.props.value,
                item: null,
                itemView: '',
                myNumber: 4,
            };
        } else {
            this.state = {
                askQuantityVisiblity: false,
                modalVisible: false,
                services: [],
                item: null,
                itemView: '',
                myNumber: 4,
            };
        }
    }

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

    setQuantity(inputText) {
        this.state.item.quantity = inputText;
    }

    confQuantity() {
        let finded = false;
        let findex;
        for (let i = 0; i < this.props.items.length; i++) {
            if (this.props.items[i].guid === this.state.item.guid) {
                finded = true;
                findex = i;
            }
        }
        let newServ = this.props.items.slice();
        if (!finded) {
            newServ = this.props.items.concat(this.state.item);
        } else {
            newServ[findex].quantity = this.state.item.quantity;
        }

        this.setState({services: newServ});
        setTimeout(() => {
            this.props.onChange(newServ);
        }, 400);

        this.askQuantity(false);
    }

    askQuantity(val) {
        this.setState({askQuantityVisiblity: val});
    }

    renderItem = (rowData, index) => {
        return (
            <ListItem
                title={rowData.item.name}
                subtitle={rowData.item.price}
                onPress={() => {
                    this.select(rowData.item);
                }}
            />
        );
    };


    render() {
        const {text} = this.state;
        return (
            <View style={[{backgroundColor: '#fff'}]}>
                <Text style={styles.label}>Услуги</Text>
                {!this.props.items.length ? <Text style={styles.item}>&lt;Добавьте услуги> </Text> : null}
                <FlatList
                    data={this.props.items}
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
                    onPress={() => this._showServicePicker()}
                    buttonStyle={styles.addBtn}
                    icon={{name: 'add', color: '#fff'}}
                    title="Добавить услугу"
                />

                <Divider/>

                <Dialog
                    visible={this.state.askQuantityVisiblity}
                    onTouchOutside={() => {
                        this.setState({askQuantityVisiblity: false});
                    }}
                    footer={
                        <DialogFooter style={{flexDirection: 'row'}}>

                            <DialogButton
                                text="Cancel"
                                onPress={() => {
                                    this.setState({askQuantityVisiblity: false});
                                }}
                            />
                            <DialogButton
                                text="OK"
                                onPress={() => {
                                    this.confQuantity();
                                }}
                            />
                        </DialogFooter>
                    }>
                    <DialogTitle
                        title={this.state.itemView}
                    />
                    <DialogContent>
                        <TextInput
                            ref={'textInputQuantity'}
                            placeholder={'Введите количество'}
                            editable={true}
                            keyboardType={'numeric'}
                            value={this.state.Total}
                            onChangeText={(text) => this.setQuantity(text, 2)}/>
                    </DialogContent>
                </Dialog>


                <Modal
                    style={{zIndex: 1000}}
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
