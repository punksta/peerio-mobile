import React, { Component } from 'react';
import {
    View, Text, LayoutAnimation, Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import { tu } from '../utils/translator';
import Layout1 from '../layout/layout1';
import Logo from '../controls/logo';
import Button from '../controls/button';
import styles, { vars } from '../../styles/styles';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.33;

@observer
export default class LoginWizardBase extends Component {
    /**
     * Animation sequence (start with index 0)
     * 1. new index becomes 1 (this.index === 1)
     * 2. view 0 slides out (this.index === 1, this.currentIndex === 1)
     * 3. view 1 appears (this.currentIndex === 1) to the left (because this.animatedIndex === 0)
     * 4. view 1 slides in (this.animatedIndex === 1)
     */
    @observable index = 0;
    @observable currentIndex = 0;
    @observable animatedIndex = 0;
    @observable pages = [];

    constructor(props) {
        super(props);
        reaction(() => this.index, i => {
            setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this.animatedIndex = i;
            }, 200);
            setTimeout(() => {
                this.currentIndex = i;
            }, 100);
            LayoutAnimation.easeInEaseOut();
        });
    }

    animatedContainer(key, item, index) {
        const currentView = index === this.currentIndex;
        const shiftNew = index > this.animatedIndex ? width : 0;
        const shift = index < this.index ? -width : shiftNew;
        const animation = { left: shift };
        const container = { flexGrow: 1 };
        return item && currentView && (
            <View key={key} style={[container, animation]}>
                {item}
            </View>
        );
    }

    footerContainer() {
        const footerBody = this.footer();
        return footerBody && (
            <View style={{ marginHorizontal: -40 }}>
                {footerBody}
            </View>
        );
    }

    footer() {
        return null;
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View
                style={[style.containerFlex, { height }]}>
                <View style={{ height: logoHeight, justifyContent: 'center' }}>
                    <Logo />
                </View>
                {this.pages.map((k, i) => this.animatedContainer(k, this[k](), i))}
                {this.footerContainer()}
            </View>
        );
        return <Layout1 body={body} footer={null} />;
    }
}
