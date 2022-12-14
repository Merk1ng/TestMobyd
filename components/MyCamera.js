import {
    ListView,
    Modal,
    Image,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    PermissionsAndroid,
    TouchableOpacity,
    View,
    Linking,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import React from 'react';
import {ListItem, Icon, SearchBar, Divider, Button} from 'react-native-elements';
import {RNCamera} from 'react-native-camera';
import Logger from '../helpers/Logger';


export class MyCamera extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            hasCameraPermission: null,
            processing: false,
            iconColor: '#000',
        };

        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your storage ' +
                        'so you can save your photos',
                },
            ).then(res => {
                //console.log(res);
            });

        } catch (err) {
            console.log('permission denied');
            console.log(err);
            Logger.log('permission denied');
            Logger.log(err);
        }
    }

    takePicture = async function () {
        this.setState({iconColor: '#fff'});
        if (this.camera) {
            const options = {quality: 0.75, base64: false};
            this.camera.takePictureAsync(options)
                .then(data => {
                    this.setState({iconColor: '#000'});
                    return CameraRoll.saveToCameraRoll(data.uri, 'photo');
                })
                .then(res => {
                    this.props.onTakePicture({
                        uri: res,
                        url: null,
                    });
                })
                .catch(err => {
                    Logger.log(err);
                    this.setState({iconColor: '#000'});
                });
        }
    };

    openExternalCamera() {
        Linking.openURL('camera://details?id=com.myapp.package').then((supported) => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        });
    }

    render() {

        return (
            <View style={[{backgroundColor: '#fff'}]}>
                <ScrollView
                    horizontal={true}
                    style={{flexDirection: 'row'}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {this.props.images.map((image) => {
                        return (
                            <Image
                                style={{width: 100, height: 100, margin: 5}}
                                source={{uri: image.uri}}
                            />
                        );
                    })}
                </ScrollView>

                <Button
                    onPress={() => {
                        this.setState({modalVisible: true});
                    }}
                    buttonStyle={styles.saveBtn}
                    icon={{name: 'photo', color: '#fff'}}
                    title="Добавить фото"
                />

                <Divider/>


                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false});
                    }}>

                    <View style={styles.container}>
                        <RNCamera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={styles.preview}
                            type={RNCamera.Constants.Type.back}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            onGoogleVisionBarcodesDetected={({barcodes}) => {
                                console.log(barcodes);
                            }}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            androidRecordAudioPermissionOptions={{
                                title: 'Permission to use audio recording',
                                message: 'We need your permission to use your audio',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                        />
                        <Icon
                            disabled={false}
                            color={this.state.iconColor}
                            onPress={this.takePicture.bind(this)}
                            iconStyle={{fontSize: 60, padding: 25}}
                            name='camera'/>

                    </View>
                </Modal>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 5,
        color: '#789',
        fontSize: 14,
        paddingLeft: 15,
        height: 30,
    },
    saveBtn: {
        margin: 10,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 1,
        alignSelf: 'center',
    },
});

export default MyCamera;
