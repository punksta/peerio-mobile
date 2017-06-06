import RoutedState from '../routes/routed-state';
import { tx } from '../utils/translator';

class ContactAddState extends RoutedState {
    get title() {
        if (this.routerMain.currentIndex === 0) return tx('title_contacts');
        return '';
    }

    onTransition(active, contact) {
        console.log('contacts add on transition');
    }
}

const contactAddState = new ContactAddState();
export default contactAddState;
