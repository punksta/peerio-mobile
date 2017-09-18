import React from 'react';
import { observer } from 'mobx-react/native';
import { Animated, Dimensions, StatusBar, Platform, ScrollView } from 'react-native';
import { reaction, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import routerModal from '../routes/router-modal';

@observer
export default class ModalLayout extends SafeComponent {
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
                    .start(() => { routerModal.animating = false; });
            } else {
                Animated.timing(this.modalAnimated, { toValue: this.height, duration })
                    .start(() => { this.modal = null; });
            }
        });
    }

    get androidTapContainer() {
        const grow = { flex: 1, flexGrow: 1 };
        return (
            <ScrollView
                keyboardShouldPersistTaps="never"
                contentContainerStyle={grow} style={grow} scrollEnabled={false}>
                {this.modal}
            </ScrollView>
        );
    }

    renderThrow() {
        const modalStyle = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        const transformModal = [{ translateY: this.modalAnimated }];
        const modalAnimatedStyle = [modalStyle, { transform: transformModal }];
        const sbStyle = routerModal.current && routerModal.current.isWhite ? 'light-content' : 'default';
        return (
            <Animated.View style={modalAnimatedStyle}>
                {Platform.OS === 'android' ? this.androidTapContainer : this.modal}
                <StatusBar
                    barStyle={!routerModal.animating && routerModal.current ? sbStyle : undefined}
                    hidden={Platform.OS !== 'android' && !this.modal} />
            </Animated.View>
        );
    }
}
