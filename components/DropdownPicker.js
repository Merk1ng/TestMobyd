import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Picker
} from 'react-native';
import {
    FormLabel,
    Divider
} from 'react-native-elements'

export class DropdownPicker extends React.Component {

    render() {
        if(!Array.isArray(this.props.items) || this.props.items.length < 2){
            return null;
        }

        return (
            <View style={[{backgroundColor: '#fff'}]}>
                <Text style={styles.label} onPress={() => this.setState({modalVisible: true})}>
                    {this.props.title}
                </Text>
                <TouchableOpacity>
                    <Picker style={styles.picker}
                            mode={'dropdown'}
                            enabled={!this.props.disabled}
                            selectedValue={this.props.value}
                            onValueChange={itemValue => {
                                this.props.onChange(itemValue);
                            }}>
                        {this.props.items.map((i, index) => (
                            <Picker.Item key={index} label={i.name} value={i}/>
                        ))}
                    </Picker>
                </TouchableOpacity>
                <Divider/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        height: 30,
        color: "#789"
    },
    label: {
        marginTop: 5,
        color: "#89a",
        left: 8
    }
});

