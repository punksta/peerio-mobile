import { observable, action } from 'mobx';

const popupState = observable({
    popupControls: [],

    get activePopup() {
        const pc = this.popupControls;
        return pc.length ? pc[pc.length - 1] : null;
    },

    showPopup: action.bound(function(popup) {
        this.popupControls.push(popup);
    }),

    discardPopup: action.bound(function() {
        this.popupControls.pop();
    })
});

export default popupState;
