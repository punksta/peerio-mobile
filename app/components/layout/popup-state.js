import { observable } from 'mobx';

class PopupState {
    @observable popupControls = [];

    get activePopup() {
        const pc = this.popupControls;
        return pc.length ? pc[pc.length - 1] : null;
    }

    showPopup = popup => {
        this.popupControls.push(popup);
    };

    showPopupPromise = caller => {
        return new Promise((resolve, reject) => this.showPopup(caller(resolve, reject)));
    };

    discardPopup = () => {
        this.popupControls.pop();
    };

    discardAllPopups() {
        this.popupControls.splice(0, this.popupControls.length);
    }
}

export default new PopupState();
