import { Alert } from 'react-native';
import InAppBilling from 'react-native-billing';
import PaymentsBase from './payments-base';

class PaymentsAndroid extends PaymentsBase {
    purchase(id) {
        return InAppBilling.open()
            .then(() => InAppBilling.purchase(id))
            .then(() => Alert.alert('Purchase Successful', id))
            .catch(e => {
                console.error(e);
                Alert.alert('Purchase Unsuccessful', id)
            });
    }

    test() {
        this.purchase('com.peerio.storage.50.monthly');
    }
}

export default PaymentsAndroid;
