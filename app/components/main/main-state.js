import { observable, action } from 'mobx';

const mainState = observable({
    isLeftMenuVisible: true,
    isRightMenuVisible: false,
    isInputVisible: false,
    route: null,

    @action recent() {
        this.isInputVisible = false;
        this.route = 'recent';
    },

    @action chat() {
        this.isInputVisible = true;
        this.route = 'chat';
    },

    @action addMessage(msg) {
        this.chatItems.push(msg);
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
            darling. You do know I love Justin,
            and nothing will stop me from SENDING
            YOU more burning prank gifts`
        }
    ]
});

export default mainState;
