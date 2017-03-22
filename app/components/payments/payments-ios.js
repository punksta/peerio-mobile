import { NativeModules, AlertIOS } from 'react-native';
import PaymentsBase from './payments-base';

const { InAppUtils } = NativeModules;

class PaymentsIos extends PaymentsBase {
    purchase(id) {
        InAppUtils.purchaseProduct(id, (error, response) => {
            if (response && response.productIdentifier) {
                AlertIOS.alert('Purchase Successful', `Your Transaction ID is + ${response.transactionIdentifier}`);
            }
            if (error) {
                AlertIOS.alert('Purchase Unsuccessful', `${id}`);
                console.log(error);
            }
        });
    }

    test() {
        this.purchase('com.peerio.storage.50.monthly');
    }
}

export default PaymentsIos;
