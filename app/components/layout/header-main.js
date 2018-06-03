import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import CommonHeader from '../shared/common-header';
import routerMain from '../routes/router-main';
import { vars } from '../../styles/styles';
import BackIcon from './back-icon';
import testLabel from '../helpers/test-label';
import icons from '../helpers/icons';

@observer
export default class HeaderMain extends SafeComponent {
    renderThrow() {
        let leftIcon = this.props.leftIcon || null;
        const rightIcon = this.props.rightIcon || null;
        if (routerMain.isBackVisible) {
            leftIcon = <BackIcon testID="buttonChatBack" />;
        }
        const textStyle = {
            color: vars.white,
            fontSize: vars.font.size.huge,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'blue',
            borderWidth: 0,
            backgroundColor: 'transparent'
        };
        const actionContainerStyle = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        };
        const outerStyle = {
            backgroundColor: vars.darkBlue
        };
        const { titleAction } = routerMain;
        const title = this.props.title || routerMain.title;
        const titleComponent = (
            <TouchableOpacity
                {...testLabel(title)}
                style={actionContainerStyle}
                activeOpacity={titleAction ? 0.2 : 1}
                onPress={titleAction}
                pressRetentionOffset={vars.retentionOffset}>
                <Text semibold ellipsizeMode="middle" numberOfLines={1} style={textStyle}>
                    {title}
                </Text>
                {titleAction && icons.whiteNoPadding('arrow-drop-down', titleAction)}
            </TouchableOpacity>
        );
        // this is for animation purposes so that object gets completely redrawn on transition
        const unique = `header_${routerMain.route}_${routerMain.currentIndex}`;
        return <CommonHeader {...{ unique, titleComponent, leftIcon, rightIcon, outerStyle }} />;
    }
}

