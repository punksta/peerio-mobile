import { observable } from 'mobx';
import { Image, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

class CachedImage {
    @observable source = null;
    @observable width = 0;
    @observable height = 0;
}

class InlineImageCacheStore {
    data = {};

    getImage(imagePath) {
        const { data } = this;
        let result = data[imagePath];
        if (!result) {
            result = new CachedImage();
            data[imagePath] = result;
            imagePath.startsWith('http') ?
                this.getImageByUrl(result, imagePath) :
                this.getImageByFileName(result, imagePath);
        }
        return result;
    }

    getImageByUrl(image, url) {
        // calculate size
        this.getSizeByUrl(url).then(({ width, height }) => {
            image.width = width;
            image.height = height;
            image.source = { uri: url };
        });
    }

    getImageByFileName(image, path) {
        let normalizedPath = path;
        if (Platform.OS === 'android') normalizedPath = `file://${path}`;
        // calculate size
        this.getSizeByFilename(normalizedPath).then(({ width, height }) => {
            console.debug(`local filesize: ${width}, ${height}`);
            image.width = width;
            image.height = height;
            image.isLocal = true;
            image.source = { uri: normalizedPath };
        });
    }

    async getSizeByUrl(url) {
        return new Promise(resolve =>
            Image.getSize(url, (width, height) => {
                console.log('got size');
                console.log(width, height);
                resolve({ width, height });
            }));
    }

    async getSizeByFilename(path) {
        return await ImagePicker.getImageDimensions(path);
    }
}

const inlineImageCacheStore = new InlineImageCacheStore();
export default inlineImageCacheStore;
