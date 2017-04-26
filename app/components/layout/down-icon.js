import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import routerModal from '../routes/router-modal';
import HeaderIconBase from './header-icon-base';

@observer
export default class DownIcon extends HeaderIconBase {
    icon = 'arrow-drop-down';
    action = () => routerModal.chatInfo();
}
