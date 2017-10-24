import HeaderIconBase from './header-icon-base';

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';
    // this style needs to move to popups
    // style = { borderTopColor: vars.yellowLine, borderTopWidth: 8 };
    action = () => this.props.action();
}
