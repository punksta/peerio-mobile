import { Platform } from 'react-native';
import PaymentsIos from './payments-ios';
import PaymentsAndroid from './payments-android';

const payments = (Platform.OS === 'android') ? new PaymentsAndroid() : new PaymentsIos();

export default payments;
