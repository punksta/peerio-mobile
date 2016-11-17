import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const options = {
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default {
    test() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can display the image using either data...
                let source = { uri: `data:image/jpeg;base64,${response.data}`, isStatic: true };

                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
                } else {
                    source = { uri: response.uri, isStatic: true };
                }

                this.setState({
                    avatarSource: source
                });
            }
        });
    }
};
