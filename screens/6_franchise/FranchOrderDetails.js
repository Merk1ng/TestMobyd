import React from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    ScrollView,
    Picker,
    Text,
    ActivityIndicator,
    View,
    FlatList, TouchableOpacity, Dimensions, TextInput,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import SupplierGoodsPicker from '../../components/SupplierGoodsPicker';
import {RetailComment} from '../../components/RetailComment';
import CommonFunctions from '../../helpers/CommonFunctions';
import Dialog, {
    DialogButton,
    DialogContent,
    DialogFooter,
    DialogTitle,
    SlideAnimation,
} from 'react-native-popup-dialog';
import * as firebase from 'firebase';
import {CategoryPicker} from '../../components/CategoryPicker';
import InventoryGoodsPicker from '../3_retail/components/InventoryGoodsPicker';
import MobidServer1C from '../../helpers/MobidServer1C';
import DocumentOperations from '../../helpers/DocumentOperations';
import DocumentDetails from '../../prototypes/DocumentDetails';
import {DialogProcess} from '../../components/DialogProcess';
import {CheckBox} from 'react-native-elements';
import {DatePicker} from '../../components/DatePicker';
import FranchGoodsPicker from '../../components/FranchGoodsPicker';

export class FranchOrderDetails extends DocumentDetails {

    _AsyncStorageKey = 'FranchOrders';
    _Title = 'Заказ';
    _ListScreen = 'HomeScreen';

    onChangeItem(item) {

        if(!item.quantity) {
            return;
        }

        let newlist = JSON.parse(JSON.stringify(this.state.items));

        newlist.push(item);

        let s = 0;
        newlist.forEach(item => {
            if (item.price) {
                s += Number.parseFloat(item.price) * item.quantity;
            }
        });

        this.setState({items: newlist, sum: s});
    }

   save = () => {
        this.setState({processing: true});
        let dv = JSON.parse(JSON.stringify(this.state));

        firebase.database().ref('franch/' + global.user.name + '/' + this.state.id).set(dv)
            .done(() => {
                this.setState({processing: false});
                Alert.alert("", 'Документ успешно отправлен');
                this.props.navigation.goBack();
            });
    };

    renderGoodItem = itemRow => {

        return (
            <TouchableOpacity
                style={{flexDirection: 'row', backgroundColor: '#fff'}}
                onPress={() => {
                    if (!this.disabled) {
                        this.setState({item: itemRow.item, itemView: itemRow.item.name});
                        this.askQuantity(true);
                    }
                }}
                onLongPress={() => {
                    if (!this.disabled) {
                        this.setState({
                            item: itemRow.item,
                            itemView: itemRow.item.name,
                            askDeleteVisible: true,
                        });
                    }
                }}
            >
                <Text numberOfLines={2} style={styles.item33}>{itemRow.item.name}</Text>
                <Text
                    style={styles.itemC}>{itemRow.item.quantity + ' ' + itemRow.item.unit_name + '. \n' + Number.parseFloat(itemRow.item.price).toFixed(2) + '₽'}</Text>
            </TouchableOpacity>
        );
    };

    askQuantity() {

    }

    confirmQuantity() {

    }

    setQuantity(text) {
        this.setState({Total: text});
    }

    getBody() {
        return (
            <View>
                <DatePicker
                    value={this.state.shipment_date}
                    disabled={this.disabled}
                    onChange={(date) => this.setState({shipment_date: date})}
                />

                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.5}}>
                        <CheckBox
                            title='Безнал'
                            checked={this.state.cashless}
                            onPress={() => this.setState({cashless: !this.state.cashless})}
                        />
                    </View>
                    <View style={{flex: 0.5}}>
                        <CheckBox
                            title='Самовывоз'
                            checked={this.state.pickup}
                            onPress={() => this.setState({pickup: !this.state.pickup})}
                        />
                    </View>
                </View>
                <Text style={styles.label}>Номенклатура</Text>

                {!this.state.items || !this.state.items.length ? <Text style={styles.item}>&lt;Добавьте товары> </Text> : null}

                <FlatList
                    style={{backgroundColor: '#fff'}}
                    data={this.state.items}
                    renderItem={this.renderGoodItem}
                />
                <FranchGoodsPicker
                    disabled={this.disabled}
                    onChange={(item) => this.onChangeItem(item)}
                />

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
                                    this.confirmQuantity();
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
                            placeholder={'Введите количество'}
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
        flex: 1,
        backgroundColor: '#fff',
    },
    item: {
        padding: 5,
        color: '#789',
        fontSize: 14,
        paddingLeft: 15,
        backgroundColor: '#fff',
        height: 50,
    },
    saveBtn: {
        marginTop: 20,
    },
    item33: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        width: Dimensions.get('window').width * 0.8,
        paddingLeft: 8,
        height: 43,
        justifyContent: 'space-between',
    },
    itemC: {
        padding: 0,
        color: '#456',
        fontSize: 14,
        paddingLeft: 8,
        height: 43,
        width: Dimensions.get('window').width * 0.2,
        right: 2,
        position: 'absolute',
    },
    saveBtn33: {
        margin: 10,
    },
    label: {
        marginTop: 5,
        color: '#89a',
        backgroundColor: '#fff',
        left: 8,
    },
    actionBtn: {
        margin: 10,
    },
});

export default FranchOrderDetails;
