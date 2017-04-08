import React, { Component } from 'react';
import { Animated, Dimensions, StatusBar, Platform } from 'react-native';
import { reaction, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import routerModal from '../routes/router-modal';

@observer
export default class ModalLayout extends Component {
    @observable modal = null;

    constructor(props) {
        super(props);
        this.height = Dimensions.get('window').height;
        this.modalAnimated = new Animated.Value(this.height);
    }

    componentDidMount() {
        reaction(() => routerModal.modal, modal => {
            const duration = vars.animationDuration;
            if (modal) {
                this.modal = modal;
                routerModal.animating = true;
                Animated.timing(this.modalAnimated, { toValue: 0, duration })
                    .start(() => (routerModal.animating = false));
            } else {
                Animated.timing(this.modalAnimated, { toValue: this.height, duration })
                    .start(() => (this.modal = null));
            }
        });
    }

    render() {
        const modalStyle = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        const transformModal = [{ translateY: this.modalAnimated }];
        const modalAnimatedStyle = [modalStyle, { transform: transformModal }];
        return (
            <Animated.View style={modalAnimatedStyle}>
                {this.modal}
                <StatusBar
                    barStyle={this.modalVisible ? 'default' : undefined}
                    hidden={Platform.OS !== 'android' && !this.modal} />
            </Animated.View>
        );
    }
}
