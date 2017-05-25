import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import routerMain from '../routes/router-main';
import HeaderIconBase from './header-icon-base';

export default class BackIcon extends HeaderIconBase {
    icon = 'arrow-back';
    action = () => routerMain.back();
}
