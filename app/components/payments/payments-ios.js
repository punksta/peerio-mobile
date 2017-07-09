import { NativeModules, AlertIOS } from 'react-native';
import PaymentsBase from './payments-base';
import { socket } from '../../lib/icebear';

const { InAppUtils } = NativeModules;

const products = [
    'com.peerio.storage.50.yearly',
    'com.peerio.storage.50.monthly'
];

class PaymentsIos extends PaymentsBase {
    loaded = false;
    products = [];

    premiumYearlyID = 'com.peerio.storage.50.yearly';
    premiumMonthlyID = 'com.peerio.storage.50.monthly';
    professionalYearlyID = 'com.peerio.storage.50.yearly';
    professionalMonthlyID = 'com.peerio.storage.50.monthly';

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
                resolve(response);
            }
            if (error) {
                console.log('payments-ios.js: purchase unsuccessful');
                console.log(error);
                AlertIOS.alert(`Purchase is unsuccessful: ${id}, please contact support`);
                reject(error);
            }
        }));
    }

    async purchase(id) {
        try {
            await this.load();
            const response = await this.purchaseProduct(id);
            if (!response.transactionReceipt) throw new Error('payments-ios.js: receipt is empty');
            const payload = {
                store: 'ios',
                receipt: response.transactionReceipt
            };
            const serverResponse = await socket.send('/auth/paid-plans/mobile-purchase/register', payload);
            console.log(serverResponse);
            console.log(`🚲 payments-ios.js: register result success ${id}`);
        } catch (e) {
            console.log('🚲 payments-ios.js: error registering');
            console.error(e);
        }
    }

    test() {
        this.purchase('com.peerio.storage.50.monthly');
    }
}

export default PaymentsIos;
