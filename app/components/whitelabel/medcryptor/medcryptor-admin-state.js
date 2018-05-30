import { t } from 'peerio-translator';
import RoutedState from '../../routes/routed-state';

class MedcryptorAdminState extends RoutedState {
    get title() {
        return t('title_welcome');
    }
}

export default new MedcryptorAdminState();
