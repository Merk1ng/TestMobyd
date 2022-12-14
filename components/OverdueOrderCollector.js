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

export class OverdueOrderCollector extends React.Component {

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
        var date = new Date();

       {Alert.alert(`Просрочено.Дата: ${date.getDate()} месяц: Dec. `)}; //Дата: ${CommonFunctions.shipment}
        //new Date()
        //console.log(new Date());

        


    }; //Данные кнопки

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

    setQuantity(text){
        this.setState({Total: text});
    }

    constructor(props) {
        super(props);
        this.state = {modalVisible: false};
    }
   

   

    render(){

        return (

            <View style={styles.container}>

               
                <Modal
                    animationType="slide"
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>

                   
                </Modal>

                <Dialog
                    width={0.9}
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => {
                        this.setState({dialogVisible: false});
                    }}
                    footer={
                        <DialogFooter style={{flexDirection: 'row'}}>
                            <DialogButton
                                text="Отмена"
                                onPress={() => {
                                    this.setState({dialogVisible: false});
                                }}
                            />
                            <DialogButton
                                text="OK"
                                onPress={() => {
                                    this.confirmValue();
                                }}
                            />
                        </DialogFooter>
                    }>

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

export default OverdueOrderCollector;
