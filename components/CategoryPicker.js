import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert,
    Picker,
    Modal, AsyncStorage
} from 'react-native';
import {
    ListItem,
    Input,
    FormLabel,
    SearchBar, Divider
} from 'react-native-elements'
import CommonFunctions from "../helpers/CommonFunctions";

export class CategoryPicker extends React.Component {

    render() {
        return (
            <View style={[{backgroundColor: '#fff'}]}>
                <Text style={styles.label} onPress={() => this.setState({modalVisible: true})}>Заполнить по группе</Text>
                <TouchableOpacity>
                    <Picker style={styles.picker}
                            mode={'dropdown'}
                            enabled={!this.props.disabled}
                            selectedValue={this.props.value}
                            onValueChange={(itemValue, itemIndex) => {
                                this.props.onChange(itemValue);
                            }}>
                        <Picker.Item key="0" label="Тара" value="Тара"/>
                        <Picker.Item key="1" label="Разливное пиво" value="Разливное пиво"/>
                        <Picker.Item key="2" label="Бутылочное пиво" value="Бутылочное пиво"/>
                        <Picker.Item key="3" label="Весовые снеки" value="Весовые снеки"/>
                        <Picker.Item key="4" label="Фасованные снеки" value="Фасованные снеки"/>
                        <Picker.Item key="5" label="Сигареты" value="Сигареты"/>
                        <Picker.Item key="6" label="Рыба" value="Рыба"/>
                        <Picker.Item key="7" label="Прочее" value="Прочее"/>

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

