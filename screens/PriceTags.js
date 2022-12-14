import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert,
    Dimensions,
    ListView,
    Modal, FlatList, TextInput, ScrollView
} from 'react-native';
import {
    ListItem,
    Input,
    Card,
    FormLabel,
    SearchBar, Divider, Button, Icon
} from 'react-native-elements'
import AppHeader from "../components/AppHeader";
import {BarcodeScanner} from "../components/BarcodeScanner";
import CommonFunctions from "../helpers/CommonFunctions";
import * as firebase from "firebase";

export class PriceTags extends React.Component {

    static navigationOptions = {
        title: 'Ценники',
        drawerIcon:
            <Icon
                name='tag'
                color='#000'
                type='font-awesome'
            />
    };

    constructor(props) {
        super(props);
        this.state = {
            barcodeScannerVisible: false,
            items: []
        }
    }

    clickItem(item) {
        let arr = this.state.items;
        for(let i=0; i< arr.length; i++) {
            if (arr[i].name === item.name ) {
                return;
            }
        }
        this.setState({lastTwo: [item]});
        this.state.items.push(item);
    }

    findGoodByBarcode(value) {
        let finded = [];
        if (Array.isArray(value)) {
            value.forEach(scanned => {
                global.barcodes.forEach(current => {
                    if (current.barcode === scanned.data) {
                        this.clickItem(CommonFunctions.getReference(current, global.goods));
                        // this.setState({barcodeScannerVisible: false});
                    }
                })
            })
        }
    }

    delete(item) {
        let arr = this.state.items;
        for(let i=0; i< arr.length; i++) {
            if (arr[i].name === item.name ) {
                arr.splice(i, 1);
                this.setState({items: arr});
            }
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="arrow-back"
                    title="Печать ценников"
                    rightIcon="done"
                    leftIconAction={() => {
                        this.props.navigation.navigate('HomeScreen')
                    }}
                    rightIconAction={() => {
                        firebase.database().ref('e/PriceTags/' + global.user.name).set(this.state.items, function (success) {
                            Alert.alert("Успешно отправлено", "Теперь вы можете загрузить отсканированные товары в 1С");
                        });
                    }}
                />

                <ScrollView>
                    {this.state.items.map(item => {
                        return (
                            <ListItem
                                title={item.name}
                                rightIcon={{name: 'delete', color:'#777', onPress: () => this.delete(item)}}
                            />
                        );
                    })}
                </ScrollView>

                <View style={{
                    flexDirection: 'row', position: 'absolute', bottom: 0, width: "100%"
                }}>
                    <Button buttonStyle={{
                        width: (Dimensions.get('window').width * 0.5 - 6),
                        marginLeft: 4,
                        marginBottom: 4
                    }}
                            onPress={() => {
                                this.setState({barcodeScannerVisible: true});
                            }}
                            title="Сканировать"
                    />
                    <Button buttonStyle={{
                        width: (Dimensions.get('window').width * 0.5 - 6),
                        marginLeft: 4,
                        marginRight: 4,
                        marginBottom: 4
                    }}
                            onPress={() => {

                            }}
                            title="Добавить"
                    />
                    <BarcodeScanner
                        lastTwo={this.state.lastTwo}
                        visible={this.state.barcodeScannerVisible}
                        onChange={(value) => {
                            this.findGoodByBarcode(value);
                        }}
                        onCancel={() => {
                            this.setState({barcodeScannerVisible: false});
                        }}
                    />
                </View>
            </View>
        )
            ;
    }
}

export default PriceTags;
