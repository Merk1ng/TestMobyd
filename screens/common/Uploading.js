import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    AsyncStorage,
    Modal,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import * as firebase from 'firebase';
import CommonFunctions from '../../helpers/CommonFunctions';
import * as Progress from 'react-native-progress';
import Logger from '../../helpers/Logger';

export class Uploading extends Component {

    static navigationOptions = CommonFunctions.getNavigationOptions('Выгрузка', 'cloud-upload');

    static progress_state = 0;

    ASYNC_STORAGE_KEY = 'Documents';

    constructor(props) {
        super(props);
        this.props.navigation.addListener('willFocus', () => this.willFocus());
        this.state = {loading: true, progress: 0};
    }

    willFocus() {
        this.setState({loading: true, progress: 0});
        this._upload();
    }

    dismiss() {
        this.setState({loading: false, dismissed: true});
        this.props.navigation.goBack();
    }


    _upload() {


                if (!Array.isArray(global.documents) || global.documents.length === 0) {

                    Promise.all([
                        AsyncStorage.getItem(this.ASYNC_STORAGE_KEY + '_Local'),
                        AsyncStorage.getItem(this.ASYNC_STORAGE_KEY),
                    ]).then(results => {
                        let data_0 = JSON.parse(results[0]) || [];
                        let data_1 = JSON.parse(results[1]) || [];
                        global.documents = data_1.concat(data_0);

                        console.log(global.documents);


                        if (!Array.isArray(global.documents) || global.documents.length === 0) {
                            this.setState({loading: false});
                            Alert.alert('Новых документов нет');
                            this.props.navigation.goBack();
                            return;
                        }

                        if (global.user.type === 1) {
                            let promises = [];
                            global.documents.forEach(doc => {
                                promises.push(firebase.database().ref('i/' + global.user.name + '/' + doc.id).set(doc));
                            });

                            Promise.all(promises).then(res => {
                                this.setState({loading: false});
                                Alert.alert('Выгрузка выполнена');
                                global.documents = [];
                                AsyncStorage.removeItem('documents')
                                    .then(res => {

                                    });
                                this.props.navigation.goBack();
                            }).catch(err => {
                                this.setState({loading: false});
                                Alert.alert('Ошибка выгрузки', JSON.stringify(err));
                                this.props.navigation.goBack();
                            });
                        }

                        if (global.user.type === 2) {

                            console.log('user');

                            let promisesDoc = [];
                            global.documents.forEach(doc => {

                                console.log(doc);

                                promisesDoc.push(
                                    new Promise((resolve, reject) => {
                                        let promisesImg = [];
                                        doc.images.forEach(img => {
                                            if (img.url) {
                                                return;
                                            }
                                            promisesImg.push(this.uploadFile(img, this));
                                        });

                                        console.log('images in progress');
                                        Promise.all(promisesImg).then(res => {
                                            console.log('images complete');
                                            console.log('doc in progress');
                                            console.log(doc);
                                            return firebase.database().ref('i/' + global.user.name + '/' + doc.id).set(doc);
                                        }).then(res => {
                                            console.log('doc complete');
                                            resolve(true);
                                        }).catch(err => {
                                            console.log(err);
                                            this.setState({loading: false});
                                            Alert.alert('Ошибка выгрузки', JSON.stringify(err));
                                            reject(err);
                                        });
                                    }),
                                );
                            });

                            Promise.all(promisesDoc).then(result => {
                                global.documents = [];
                                AsyncStorage.removeItem(this.ASYNC_STORAGE_KEY).then(res => {
                                });
                                this.setState({loading: false});
                                Alert.alert('Выгрузка выполнена');
                                this.props.navigation.goBack();
                            }).catch(err => {
                                this.setState({loading: false});
                                Alert.alert('Ошибка выгрузки', JSON.stringify(err));
                                this.props.navigation.goBack();
                            });
                        }


                    }).catch(error => {
                        Logger.log(JSON.stringify(error));
                    });


                } else {

                    // СТАРЫЙ СПОСОБ, Надо будет удалить
                    if (!Array.isArray(global.documents) || global.documents.length === 0) {
                        this.setState({loading: false});
                        Alert.alert('Новых документов нет');
                        this.props.navigation.goBack();
                        return;
                    }


                    if (global.user.type === 1) {
                        let promises = [];
                        global.documents.forEach(doc => {
                            promises.push(firebase.database().ref('i/' + global.user.name + '/' + doc.id).set(doc));
                        });

                        Promise.all(promises).then(res => {
                            this.setState({loading: false});
                            Alert.alert('Выгрузка выполнена');
                            global.documents = [];
                            AsyncStorage.removeItem('documents').then(res => {
                            });
                            this.props.navigation.goBack();
                        }).catch(err => {
                            this.setState({loading: false});
                            Alert.alert('Ошибка выгрузки', JSON.stringify(err));
                            this.props.navigation.goBack();
                        });
                    }

                    if (global.user.type === 2) {
                        let promisesDoc = [];
                        global.documents.forEach(doc => {
                            promisesDoc.push(
                                new Promise((resolve, reject) => {
                                    let promisesImg = [];
                                    doc.images.forEach(img => {
                                        if (img.url) {
                                            return;
                                        }
                                        promisesImg.push(this.uploadFile(img, this));
                                    });

                                    Promise.all(promisesImg).then(res => {
                                        return firebase.database().ref('i/' + global.user.name + '/' + doc.id).set(doc);
                                    }).then(res => {
                                        resolve(true);
                                    }).catch(err => {
                                        reject(err);
                                        this.setState({loading: false});
                                        Alert.alert('Ошибка выгрузки', JSON.stringify(err));
                                    });
                                }),
                            );
                        });

                        Promise.all(promisesDoc).then(result => {
                            global.documents = [];
                            AsyncStorage.removeItem('documents').then(res => {
                            });
                            this.setState({loading: false});
                            Alert.alert('Выгрузка выполнена');
                            this.props.navigation.goBack();
                        }).catch(err => {
                            this.setState({loading: false});
                            Alert.alert('Ошибка выгрузки', JSON.stringify(err));
                            this.props.navigation.goBack();
                        });
                    }


                }


    }


    uploadFile(file, ctx) {
        return new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                let uploadTask = firebase.storage().ref().child('photo/' + global.user.name.toUpperCase() + '/' + xhr.response._data.name).put(xhr.response);
                uploadTask.on('state_changed', function (snapshot) {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                    if (progress >= Uploading.progress_state) {
                        Uploading.progress_state = progress;
                        ctx.setState({progress: Number.parseFloat(Uploading.progress_state)});
                    }
                }, function (error) {
                    rej(error);
                }, function () {
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        file.url = downloadURL;
                        res(file);
                    });
                });
            };

            xhr.onerror = function (e) {
                res(null);
            };
            xhr.responseType = 'blob';
            xhr.open('GET', file.uri, true);
            xhr.send(null);
        });
    }


    render() {
        return (
            <Modal visible={this.state.loading}>
                <View style={styles.container}>
                    <Text style={styles.text}>Идёт выгрузка данных</Text>

                    {global.user.type === 2 && <Progress.Bar progress={this.state.progress} width={300}/>}

                    <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 40}}/>
                </View>
            </Modal>
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
    text: {
        fontSize: 20,
    },
});

export default Uploading;




