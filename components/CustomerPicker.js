import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    FlatList,
    Alert,
    Modal, AsyncStorage, TextInput, Picker,
} from 'react-native';
import {
    ListItem,
    Input,
    FormLabel,
    SearchBar, Divider, Button,
} from 'react-native-elements';
import Dialog, {DialogButton, DialogContent, DialogFooter, DialogTitle} from 'react-native-popup-dialog';

export class CustomerPicker extends React.Component {

    SearchFilterFunction = text => {

        if (!text) {
            this.setState({
                dataSource: global.customers,
                text: '',
            });
            return;
        }

        let arr = global.customers.filter(item => {
            return item.name.toUpperCase().match(text.toUpperCase());
        });

        this.setState({dataSource: arr, text: text});

        this.setState({text});

        if (!Array.isArray(arr.dataSource) || arr.lenght === 0) {
            this.setState({showAddButton: true});
        }
    };

    componentDidMount() {
        this.setState({dataSource: global.customers});
    }

    select = (partner) => () => {
        console.log(partner);
        this.setState({modalVisible: false});
        this.props.onChange(partner);

    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            newCustomerDialogVisible: false,
            showAddButton: false,
        };
    }

    setName(text) {
        this.setState({newName: text});
    }

    setAddress(text) {
        this.setState({newAddress: text});
    }

    renderItem = (rowData, index) => {
        return (
            <ListItem
                key={index}
                title={rowData.item.name}
                onPress={this.select(rowData.item)}
            />
        );
    };

    hideNewCustomerDialog = () => {
        this.setState({newCustomerDialogVisible: false});
    };

    confirmNewCustomer = () => {
        let partner = {name: this.state.newName + ', ' + this.state.newAddress, guid: 'newCustomer'};
        this.props.onChange(partner);
        this.setState({modalVisible: false, newCustomerDialogVisible: false});
    };

    newCustomerDialog() {
        return (
            <Dialog
                visible={this.state.newCustomerDialogVisible}
                onTouchOutside={this.hideNewCustomerDialog}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Отмена"
                            onPress={this.hideNewCustomerDialog}
                        />
                        <DialogButton
                            text="OK"
                            onPress={this.confirmNewCustomer}
                        />
                    </DialogFooter>
                }>

                <DialogTitle
                    title='Новый контрагент'
                />
                <DialogContent>
                    <Text style={styles.dialogLabel}>Наименование</Text>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Наименование'}
                        editable={true}
                        keyboardType={'default'}
                        value={this.state.newName}
                        onChangeText={(text) => this.setName(text, 2)}
                    />
                    <Divider/>
                    <Text style={styles.dialogLabel}>Адрес</Text>
                    <TextInput
                        ref={'textInputQuantity'}
                        placeholder={'Адрес'}
                        editable={true}
                        keyboardType={'default'}
                        value={this.state.newAddress}
                        onChangeText={(text) => this.setAddress(text, 2)}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    render() {
        const {text} = this.state;
        return (
            <View style={[{backgroundColor: '#fff'}]}>
                <Text style={styles.label} onPress={() => this.setState({modalVisible: true})}>Адрес магазина</Text>
                <TouchableOpacity onPress={() => this.setState({modalVisible: true})} onSomething={() => {
                    this.onSomething();
                }}>
                    <Text
                        style={[{paddingLeft: 15}, {color: '#456'}, {paddingTop: 3}]}>{this.props.value ? this.props.value.name : '<Выберите магазин>'}</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false});
                    }}>
                    <View style={styles.viewStyle}>
                        <SearchBar
                            round
                            value={text}
                            searchIcon={{size: 24}}
                            clearIcon={{size:34}}
                            onChangeText={this.SearchFilterFunction}
                            onClear={this.SearchFilterFunction}
                            placeholder="Type Here..."
                        />
                        <FlatList
                            data={this.state.dataSource}
                            renderItem={this.renderItem}
                            enableEmptySections={true}
                            style={{marginTop: 10}}
                        />
                        {this.state.showAddButton &&
                        <Button
                            onPress={() => {
                                this.setState({
                                    newCustomerDialogVisible: true,
                                    modalVisible: false,
                                    itemView: this.state.text,
                                    item: {newName: this.state.text, price: 0, quantity: 0},
                                });
                            }}
                            icon={{name: 'add', color: '#fff'}}
                            buttonStyle={styles.saveBtn}
                            title="Новый контрагент"
                        />
                        }
                    </View>
                </Modal>
                <Divider/>

                {this.newCustomerDialog()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        marginTop: 5,
        color: '#89a',
        left: 15,
    },
    viewStyle: {
        justifyContent: 'center',
        flex: 1,
        marginTop: 0,
    },
    textStyle: {
        padding: 10,
        paddingTop: 3,
    },
});

export default CustomerPicker;
