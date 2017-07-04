import { NativeModules, AlertIOS } from 'react-native';
import PaymentsBase from './payments-base';

const { InAppUtils } = NativeModules;

const products = [
    'com.peerio.storage.50.yearly',
    'com.peerio.storage.50.monthly'
];

class PaymentsIos extends PaymentsBase {
    loaded = false;
    products = [];

    async load() {
        if (this.loaded) return Promise.resolve(this.products);
        return new Promise(resolve =>
            InAppUtils.loadProducts(products, (error, res) => {
                console.log(res);
                this.products = res;
                resolve(res);
            })
        );
    }

    async purchaseProduct(id) {
        return new Promise((resolve, reject) => InAppUtils.purchaseProduct(id, (error, response) => {
            if (response && response.productIdentifier) {
                console.log('payments-ios.js: purchase successful');
                console.log(response);
                AlertIOS.alert('Purchase Successful', `Your Transaction ID is + ${response.transactionReceipt}`);
                resolve(response);
            }
            if (error) {
                console.log('payments-ios.js: purchase unsuccessful');
                AlertIOS.alert('Purchase Unsuccessful', `${id}`);
                console.log(error);
                reject(error);
            }
        }));
    }

    async purchase(id) {
        await this.load();
        return await this.purchaseProduct(id);
    }

    test() {
        this.purchase('com.peerio.storage.50.monthly');
    }
}

export default PaymentsIos;
