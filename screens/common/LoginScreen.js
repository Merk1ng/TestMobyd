import React from 'react';
import {
    Alert,
    AsyncStorage,
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Image,
} from 'react-native';
import {FormLabel, FormValidationMessage} from 'react-native-elements';
import * as firebase from 'firebase';
import MobidServer1C from '../../helpers/MobidServer1C';

export class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            pass: '',
            err: '',
            progress: false,
        };
    }

    exec_1C() {
        let usr = 'Захаров Александр';
        let req = {
            'ТекстКоманды': `
                
                Узел = ПланыОбмена.пивМобиДД.НайтиПоКоду("${this.state.name}");
                
                Если Не ЗначениеЗаполнено(Узел) Тогда
                    Результат = Новый Структура("errType", 100003);
                    ПараметрыJSON = Новый ПараметрыЗаписиJSON(ПереносСтрокJSON.Нет, " " , Истина, ЭкранированиеСимволовJSON.Нет, Ложь, Ложь, Ложь, Ложь);
                    ЗаписьJSON = Новый ЗаписьJSON;
                    ЗаписьJSON.ПроверятьСтруктуру = Истина;
                    ЗаписьJSON.УстановитьСтроку(ПараметрыJSON);
                    ЗаписатьJSON(ЗаписьJSON, Результат);
                    СтрОтв = ЗаписьJSON.Закрыть();               
                    ЗаполнитьСтруктуруОтвета(СтруктураОтвет,200,перТекстОшибки,Истина,СтрОтв);
                ИначеЕсли Узел.КлючДоступа <> "${this.state.pass}" Тогда
                    Результат = Новый Структура("errType", 100004);
                    ПараметрыJSON = Новый ПараметрыЗаписиJSON(ПереносСтрокJSON.Нет, " " , Истина, ЭкранированиеСимволовJSON.Нет, Ложь, Ложь, Ложь, Ложь);
                    ЗаписьJSON = Новый ЗаписьJSON;
                    ЗаписьJSON.ПроверятьСтруктуру = Истина;
                    ЗаписьJSON.УстановитьСтроку(ПараметрыJSON);
                    ЗаписатьJSON(ЗаписьJSON, Результат);
                    СтрОтв = ЗаписьJSON.Закрыть();               
                    ЗаполнитьСтруктуруОтвета(СтруктураОтвет,200,перТекстОшибки,Истина,СтрОтв);   
                Иначе 
                    Если Узел.ТипИнтерфейса = "Техник" Тогда
                        type = 1;
                    ИначеЕсли Узел.ТипИнтерфейса = "Опт" Тогда
                        type = 2;
                    ИначеЕсли Узел.ТипИнтерфейса = "Розница" Тогда
                        type = 3;
                    ИначеЕсли Узел.ТипИнтерфейса = "ТехникРозница" Тогда
                        type = 4;
                    КонецЕсли;
                    
                    Результат = Новый Структура("type, name, key", type, Узел.Код, Узел.КлючДоступа);
                    ПараметрыJSON = Новый ПараметрыЗаписиJSON(ПереносСтрокJSON.Нет, " " , Истина, ЭкранированиеСимволовJSON.Нет, Ложь, Ложь, Ложь, Ложь);
                    ЗаписьJSON = Новый ЗаписьJSON;
                    ЗаписьJSON.ПроверятьСтруктуру = Истина;
                    ЗаписьJSON.УстановитьСтроку(ПараметрыJSON);
                    ЗаписатьJSON(ЗаписьJSON, Результат);
                    СтрОтв = ЗаписьJSON.Закрыть();               
                    ЗаполнитьСтруктуруОтвета(СтруктураОтвет,200,перТекстОшибки,Истина,СтрОтв);
                КонецЕсли;
                
                
            `,
        };

//        cПользователи.Вставить("TST3"	, Новый Структура("key, person, type", "zzz", "Макунин Дмитрий"			, 1));


        return MobidServer1C.fetchExec('', req);
    };

    auth() {
        this.setState({progress: true, err: ''});
        firebase.database().ref('accounts/' + this.state.name.toUpperCase()).on('value', (snapshot) => {
            let data = snapshot.val();

            if (!data) {
                this.exec_1C().then(res => {

                    data = JSON.parse(res);
                    console.log(data);
                    this.setState({progress: false});
                    if(data.errType) {
                        this.setState({err: 'Ошибка авторизации. ' + data.errType, name: '', pass: ''});
                        return;
                    }
                    if (data.key.toLowerCase() === this.state.pass.toLowerCase()) {
                        data.name = this.state.name.toUpperCase();
                        AsyncStorage.setItem('user', JSON.stringify(data)).then(res => {
                            global.user = data;
                            this.props.navigation.navigate('Splash');
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    this.setState({err: 'Ошибка авторизации. (100006)', name: '', pass: ''});
                });

              //  this.setState({err: 'Ошибка авторизации. (100008)', name: '', pass: ''});
                return;
            } else {
                this.setState({progress: false});
                if (data.key === this.state.pass.toLowerCase()) {
                    data.name = this.state.name.toUpperCase();
                    AsyncStorage.setItem('user', JSON.stringify(data)).then(res => {
                        global.user = data;
                        this.props.navigation.navigate('Splash');
                    });
                } else {
                    this.setState({err: 'Ошибка авторизации. (100002)', name: '', pass: ''});
                }
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.err !== '' && <Text style={styles.errMessage}>{this.state.err}</Text>}

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={require('../../assets/icons8-customer-40.png')}/>
                    <TextInput style={styles.inputs}
                               value={this.state.name}
                               placeholder="Пользователь"
                               keyboardType="email-address"
                               underlineColorAndroid='transparent'
                               onChangeText={(text) => this.setState({name: text})}/>
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={require('../../assets/icons8-key-2-40.png')}/>
                    <TextInput style={styles.inputs}
                               value={this.state.pass}
                               placeholder="Пароль"
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               onChangeText={(text) => this.setState({pass: text})}/>
                </View>

                {!this.state.progress &&
                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.auth()}>
                    <Text style={styles.loginText}>Войти</Text>
                </TouchableHighlight>
                }
                {this.state.progress &&
                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}>
                    <ActivityIndicator size="small" color="white"/>
                </TouchableHighlight>
                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 0,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center',
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: '#00b5ec',
    },
    loginText: {
        color: 'white',
    },
    errMessage: {
        color: 'red',
        fontSize: 14,
        margin: 10,
    },
});
