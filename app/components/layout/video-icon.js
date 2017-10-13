import HeaderIconBase from './header-icon-base';

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';
    action = () => this.props.action();
}
