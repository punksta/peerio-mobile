import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import Layout1 from '../layout/layout1';
import Center from '../controls/center';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

@observer
export default class LayoutModalExit extends Component {
    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: 14,
            fontWeight: vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', () => this.props.onClose())}
                <Center style={style}><Text style={textStyle}>{this.props.title}</Text></Center>
                {this.props.rightIcon || icons.placeholder()}
            </View>
        );
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    header() {
        return (
            <View>
                {this.lineBlock(this.exitRow())}
            </View>
        );
    }

    render() {
        const header = this.header();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout1
                defaultBar
                noFitHeight
                body={this.props.body}
                header={header}
                style={layoutStyle} />
        );
    }
}

LayoutModalExit.propTypes = {
    title: React.PropTypes.string,
    body: React.PropTypes.any,
    onClose: React.PropTypes.any,
    rightIcon: React.PropTypes.any
};
