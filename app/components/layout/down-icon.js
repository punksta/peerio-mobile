import HeaderIconBase from './header-icon-base';

export default class DownIcon extends HeaderIconBase {
    icon = 'arrow-drop-down';
    action = () => this.props.action && this.props.action();
}
