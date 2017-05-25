import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import routerModal from '../routes/router-modal';
import HeaderIconBase from './header-icon-base';

export default class DownIcon extends HeaderIconBase {
    icon = 'arrow-drop-down';
    action = () => this.props.action && this.props.action();
}
