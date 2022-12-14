import React from 'react';
import {
    StyleSheet,
    StatusBar,
    SectionList,
    FlatList,
    TouchableOpacity,
    Text,
    TextInput,
    Dimensions,
    View,
    Modal,
    Alert,
    TouchableHighlight,
    ListView,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ManagerTime from '../helpers/ManagerTime';
import {List, Divider, FormLabel, FormInput} from 'react-native-elements';


export class DatePickerManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            date: this.props.value,
            shipment: this.props.value1,
            dateFormat: ManagerTime.getStringDate(this.props.value),
            shipmentFormat: ManagerTime.getStringDate(this.props.value1),
        };
    }

    update() {
        this.setState({
            date: this.props.value,
            dateFormat: ManagerTime.getStringDate(this.props.value),
            shipment: this.props.value1,
            shipmentFormat: ManagerTime.getStringDate(this.props.value1),
        });
    }   

    componentWillReceiveProps({someProp}) {
        setTimeout(() => {
            this.setState({
                date: this.props.value,
                dateFormat: ManagerTime.getStringDate(this.props.value),
                shipment: this.props.value1,
            shipmentFormat: ManagerTime.getStringDate(this.props.value1),
            });
        }, 150);
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({date: date, dateFormat: ManagerTime.getStringDate(date)});
        this.props.onChange(this.state.date);
        this._hideDateTimePicker();
    };


    render() {
        return (
            <View style={{backgroundColor: '#fff'}}>
                <Text
                    style={global.user.type === 3 ? styles3.label : styles12.label}
                    onPress={this._showDateTimePicker}>{global.user.type === 3 || global.user.type === 6 ? 'Дата заказа - Дата Поставки' : 'Дата'}
                </Text>
                <TouchableOpacity onPress={this._showDateTimePicker}>
        <Text style={global.user.type === 3 ? styles3.date : styles12.date}>{this.state.dateFormat}</Text>
                </TouchableOpacity>
                <Divider/>
                
            </View>
           // title1={DeliveriesDate.getStringDateddMMMM(item.shipment)}
        );
    }
}

const styles12 = {
    label: {
        marginTop: 5,
        color: '#89a',
        left: 15,
    }, date: {
        paddingLeft: 15,
        color: '#456',
        paddingTop: 3,
    },
};


const styles3 = {
    label: {
        marginTop: 5,
        color: '#89a',
        left: 8,
    }, date: {
        fontSize: 16,
        paddingLeft: 8,
        color: '#789',
        paddingTop: 3,
    },
};
