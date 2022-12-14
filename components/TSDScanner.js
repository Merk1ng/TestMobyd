import {
    Modal,
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import React from 'react';
import {RNCamera} from 'react-native-camera';

export class TSDScanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {maskColor: 'white'};
    }

    render() {
        const {height, width} = Dimensions.get('window');
        const maskColWidth = (width - 300) / 2;

        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.visible}
                    onRequestClose={this.props.onCancel}>

                    <View style={styles.container}>
                        <RNCamera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={styles.preview}
                            type={RNCamera.Constants.Type.back}
                            flashMode={RNCamera.Constants.FlashMode.auto}
                            barcodeFinderVisible={true}
                            barcodeFinderWidth={280}
                            captureAudio={false}
                            barcodeFinderHeight={220}
                            barcodeFinderBorderColor="white"
                            barcodeFinderBorderWidth={2}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            defaultTouchToFocus
                            onGoogleVisionBarcodesDetected={({barcodes}) => {
                                this.props.onChange(barcodes);
                            }}
                        />

                        <View style={styles.maskOutter}>
                            <View style={[{flex: 0.8}, styles.maskRow, styles.maskFrame]}/>
                            <View style={[{flex: 30}, styles.maskCenter]}>
                                <View style={[{width: maskColWidth}, styles.maskFrame]}/>
                                <View style={[styles.maskInner, {borderColor: this.state.maskColor}]}/>
                                <View style={[{width: maskColWidth}, styles.maskFrame]}/>
                            </View>
                            <View style={[{flex: 0.8}, styles.maskRow, styles.maskFrame]}/>
                        </View>
                    </View>

                    {/* last scanned positions */}
                    <View style={{position: 'absolute', top: 4, left: 4, right: 4, height: 50}}>
                        {this.props.lastTwo ? this.props.lastTwo.map(item => {
                            return (
                                <Text style={{color: '#0a0'}}>Добавлен: {item.name} ... </Text>
                            );
                        }) : null}
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
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 1,
        alignSelf: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    enterBarcodeManualButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    cameraView: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    maskOutter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    maskInner: {
        width: 300,
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    maskFrame: {
        backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
        width: '100%',
    },
    maskCenter: {flexDirection: 'row'},
});

export default TSDScanner;
