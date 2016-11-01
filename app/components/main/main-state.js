import { observable, action } from 'mobx';
import { LayoutAnimation } from 'react-native';
import state from '../layout/state';

const mainState = observable({
    isBackVisible: false,
    isLeftMenuVisible: false,
    isRightMenuVisible: false,
    isInputVisible: false,
    route: null,
    currentIndex: 0,

    @action recent() {
        state.hideKeyboard();
        this.isInputVisible = false;
        this.route = 'recent';
        this.currentIndex = 0;
        this.isBackVisible = false;
    },

    @action chat() {
        this.isInputVisible = true;
        this.route = 'chat';
        this.currentIndex = 1;
        this.isBackVisible = true;
    },

    @action back() {
        this.recent();
    },

    @action addMessage(msg) {
        this.chatItems.push(msg);
    },

    @action toggleLeftMenu() {
        LayoutAnimation.easeInEaseOut();
        this.isLeftMenuVisible = !this.isLeftMenuVisible;
        this.isRightMenuVisible = false;
    },

    @action toggleRightMenu() {
        LayoutAnimation.easeInEaseOut();
        this.isRightMenuVisible = !this.isRightMenuVisible;
        this.isLeftMenuVisible = false;
    },


    chatItems: [
        { name: 'Alice', date: '2:23PM', message: 'Whoever sent me this prank box will suffer in hell, for sure' },
        { name: 'Bob', date: '2:24PM', message: 'That was not me' },
        { name: 'Alice',
            date: '2:25PM',
            message: `Are you sure?
            Because if it was you,
            I will find you,
            I will make you suffer,
            I will make you listen to
            Justin Bieber all your miserable
            remaining piece of life`
        },
        {
            name: 'Bob',
            date: '2:27PM',
            message: `Stop making a scene,
            darling. You do know I love Justin!`
        }
    ]
});

export default mainState;
