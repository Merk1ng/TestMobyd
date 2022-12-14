import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert,
    Dimensions,
    Modal,
    FlatList,
    TextInput, Picker,
} from 'react-native';
import {
    ListItem,
    Input,
    FormLabel,
    SearchBar, Divider, Button, Icon,
} from 'react-native-elements';
import Dialog, {DialogContent, DialogFooter, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import CommonFunctions from '../../../helpers/CommonFunctions';

export class PurchaseGoodsPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            /* Видимость управляющих элементов */
            dialog_quantity: false,
            dialog_delete: false,
            showModalPicker: false,

            /* Надписи на управляющих элементах */
            dialog_title: '',

            displayGoods: this.props.value, // список отфильтрованных пользователем товаров в ModalPicker
            pickedGoods: this.props.goods || [],                    // список выбранных пользователем товаров

            /* Свойства крана, над которым производится текущее действие */
            id: '',
            name: '',
            quantity: '1',
            storage: '',
            unit_name: '',
            unit_id: '',
            ratio: '',
            price: '',
            measurement: null,
        };
    }

    SearchFilterFunction = text => {
        if (!text) {
            this.setState({
                displayGoods: this.props.value,
                text: '',
            });
            return;
        }

        let arr = this.props.value.filter(function (item) {
            return item.name.toUpperCase().match(text.toUpperCase());
        });
        this.setState({displayGoods: arr, text: text});
    };

    clickItem = (item) => () => {
        this.setState({
            id: item.id,
            name: item.name,
            unit_id: item.unitId,
            unit_name: item.unitName,
            price: item.price,
            ratio: item.ratio,
            dialog_quantity: true,
            showModalPicker: false,
        });
    };

    confirm() {
        console.log(this.props.value);

        let cloned = JSON.parse(JSON.stringify(this.props.items));

        let val = cloned.find(item => {
            return item.id === this.state.id;
        });

        if (val) {
            val.id = this.state.id;
            val.name = this.state.name;
            val.unit_id = this.state.unit_id;
            val.unit_name = this.state.unit_name;
            val.ratio = this.state.ratio;
            val.quantity = this.state.quantity;
            val.price = this.state.price;
        } else {
            cloned.push({
                id: this.state.id,
                name: this.state.name,
                unit_id: this.state.unit_id,
                unit_name: this.state.unit_name,
                ratio: this.state.ratio,
                quantity: this.state.quantity,
                price: this.state.price,
            });
        }

        this.setState({
            dialog_quantity: false,
            showModalPicker: true,
            text: '',
            displayGoods: this.props.value,
        });

        this.props.onChange(cloned);
    }

    setQuantity(text) {
        this.setState({Total: text});
    }

    setSum(text) {
        this.setState({TotalSum: text});
    }

    keyExtractor = (rowData, index) => index.toString();

    renderItem = (rowData, index) => {
        return (
            <ListItem
                key={index}
                leftIcon={rowData.item.items ? {name: 'folder'} : null}
                title={rowData.item.name}
                onPress={this.clickItem(rowData.item)}
            />
        );
    };

    render() {
        const {text} = this.state;
        return (

            <View style={styles.container}>

                <Button
                    onPress={() => this.setState({showModalPicker: true, displayGoods: this.props.value})}
                    buttonStyle={styles.saveBtn33}
                    icon={{name: 'add', color: '#fff'}}
                    title="Добавить номенклатуру"
                />

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
                                    onPress={() => this.setState({barcodeScannerVisible: true})}
                                />
                            }
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

                <Dialog
                    visible={this.state.dialog_quantity}
                    onTouchOutside={() => this.setState({dialog_quantity: false})}
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
                        <Text style={styles.dialogLabel}>Количество</Text>
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

            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    saveBtn33: {
        margin: 10,
    },
});

export default PurchaseGoodsPicker;
