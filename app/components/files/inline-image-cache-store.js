import { observable, action } from 'mobx';
import { Image, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { TinyDb } from '../../lib/icebear';

// TODO: clean up the db once in a while
const imageCacheTinyDb = TinyDb.open('imageCaches');

class CachedImage {
    @observable source = null;
    @observable width = undefined;
    @observable height = undefined;
    @observable acquiringSize = false;
    get cacheKey() { return `cache:${this.source.uri}`; }

    @action.bound async setImageSize(width, height) {
        this.width = width;
        this.height = height;
        await imageCacheTinyDb.setValue(this.cacheKey, { width, height });
    }

    @action.bound async loadImageSize() {
        const cache = await imageCacheTinyDb.getValue(this.cacheKey);
        if (cache) {
            const { width, height } = cache;
            Object.assign(this, { width, height });
        }
        return !!cache;
    }
}

class InlineImageCacheStore {
    data = {};

    getImage(imagePath) {
        const { data } = this;
        let result = data[imagePath];
        if (!result) {
            result = new CachedImage();
            data[imagePath] = result;
            imagePath.toLowerCase().startsWith('http') ?
                this.getImageByUrl(result, imagePath) :
                this.getImageByFileName(result, imagePath);
        }
        return result;
    }

    async getImageByUrl(image, url) {
        image.source = { uri: url, cache: 'force-cache' };
        // calculate size
        // TODO: to prevent react native from downloading image twice
        // the renderer should call image.setImageSize
        // after the image has been loaded
        if (await image.loadImageSize()) return;
        image.acquiringSize = true;
        const { width, height } = await this.getSizeByUrl(url);
        image.acquiringSize = false;
        console.debug(`remote filesize: ${width}, ${height}`);
        image.setImageSize(width, height);
    }

    async getImageByFileName(image, path) {
        let normalizedPath = path;
        if (Platform.OS === 'android') {
            if (path.startsWith('/')) {
                normalizedPath = `file://${path}`;
            }
        }
        image.isLocal = true;
        image.source = { uri: normalizedPath };
        // calculate size
        if (await image.loadImageSize()) return;
        image.acquiringSize = true;
        const { width, height } = await this.getSizeByFilename(normalizedPath);
        image.acquiringSize = false;
        console.debug(`local filesize: ${width}, ${height}`);
        image.setImageSize(width, height);
    }

    async getSizeByUrl(url) {
        return new Promise(resolve =>
            Image.getSize(url, (width, height) => {
                console.log(width, height);
                resolve({ width, height });
            }));
    }

    async getSizeByFilename(path) {
        return ImagePicker.getImageDimensions(path);
    }
}

const inlineImageCacheStore = new InlineImageCacheStore();
export default inlineImageCacheStore;
