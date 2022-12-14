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
    SearchBar, Divider, Button, Icon
} from 'react-native-elements'
import Dialog, {DialogContent, DialogFooter, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import CommonFunctions from "../helpers/CommonFunctions";

export class SupplierGoodsPicker extends React.Component {

    SearchFilterFunction = text => {
        if(!text) {
            this.setState({searchText: "", dataSource: this.state.dataSourceFull});
            return;
        }
        let datasourceFull = JSON.parse(JSON.stringify(this.state.dataSourceFull));
        let datasource = datasourceFull.filter((i) => {
            console.log(i.name.toUpperCase().indexOf(text.toUpperCase()) > -1);
           return i.name.toUpperCase().indexOf(text.toUpperCase()) > -1;
        });

        this.setState({searchText: text, dataSource: datasource});
    };

    showGoodsPicker = () => {
        let responseJson = [];
        if(this.props.supplier) {
            responseJson = global.suppliersGoods['_' + this.props.supplier.guid];
        }

        console.log(responseJson);
        this.setState({dataSource: responseJson, dataSourceFull: responseJson, modalVisible: true, askQuantity: false, item: null});
    };

    clickItem = (item) => () => {
        console.log(item);
        this.setState({item: item, askQuantity: true, modalVisible: false, dialogTitle: item.name});
    };

    confirm() {
        let good = {
            name: this.state.item.name,
            quantity: this.state.Total,
            guid: this.state.item.id,
            unitId: this.state.item.unitId,
            unitName: this.state.item.unitName,
            price: 0
        };
        this.props.onChange(good);
        this.setState({askQuantity: false, modalVisible: true});

    }

    setQuantity(text) {
        this.setState({Total: text});
    }

    constructor(props) {
        super(props);
        this.state = {modalVisible: false};
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

        return (

            <View style={styles.container}>

                <Button
                    onPress={this.showGoodsPicker}
                    buttonStyle={styles.saveBtn33}
                    icon={{name: 'add', color: '#fff'}}
                    title="Добавить номенклатуру"
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>

                    <View style={styles.viewStyle}>
                        <SearchBar
                            round
                            value={this.state.searchText}
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
                            data={this.state.dataSource}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                            enableEmptySections={true}
                            style={{marginTop: 10}}
                        />
                    </View>
                </Modal>

                <Dialog
                    visible={this.state.askQuantity}
                    onTouchOutside={() => {
                        this.setState({askQuantity: false});
                    }}
                    footer={
                        <DialogFooter style={{flexDirection: 'row'}}>
                            <DialogButton
                                text="Отмена"
                                onPress={() => {
                                    this.setState({askQuantity: false});
                                }}
                            />
                            <DialogButton
                                text="OK"
                                onPress={() => {
                                    this.confirm();
                                }}
                            />
                        </DialogFooter>
                    }>
                    <DialogTitle
                        title={this.state.dialogTitle}
                    />
                    <DialogContent>
                        <Text style={styles.dialogLabel}>Количество</Text>
                        <TextInput
                            ref={'textInputQuantity'}
                            placeholder={"Введите количество"}
                            editable={true}
                            keyboardType={'numeric'}
                            value={this.state.Total}
                            onChangeText={(text) => this.setQuantity(text, 2)}
                        />
                    </DialogContent>
                </Dialog>

            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    }
});

export default SupplierGoodsPicker;
