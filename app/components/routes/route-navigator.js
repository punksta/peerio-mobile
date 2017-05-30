import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { observer } from 'mobx-react/native';
import { reaction, observable } from 'mobx';
import BgPattern from '../controls/bg-pattern';
import { navigator } from '../../styles/styles';
import { gradient } from '../controls/effects';
import uiState from '../layout/ui-state';

@observer
export default class RouteNavigator extends Component {
    @observable route = null;

    componentDidMount() {
        const routes = this.props.routes;
        this.bindRouteroutes = reaction(() => routes.route, route => {
            console.log(`route-navigator: ${routes.prevRoute}, ${route}`);

            const newIndex = routes.routesList.indexOf(route);
            const oldIndex = routes.routesList.indexOf(routes.prevRoute);
            routes.prevRoute = route;
            const rInfo = routes.routes[route];
            uiState.hideAll().then(() => {
                this.route = rInfo;
/*                if (rInfo.replace) {
                    console.log('reset route stack');
                    this.nav.immediatelyResetRouteStack([rInfo]);
                    return;
                }
                if (newIndex === oldIndex - 1) {
                    this.nav.pop();
                } else if (newIndex < oldIndex) {
                    try {
                        this.nav.jumpTo(rInfo);
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    this.nav.push(rInfo);
                } */
            });
        }, true);
    }

    renderScene(route) {
        return React.createElement(route.component, { key: `scene${route.key}` });
    }

    render() {
        const { route } = this;
        const hidden = { overflow: 'hidden' };
        const inner = route ? gradient({
            testID: `route${route.key}Scene`,
            removeClippedSubviews: false,
            style: [navigator.card, hidden]
        }, [<BgPattern key="bg" />, this.route ? this.renderScene(this.route) : null]) : null;
        return (
            <View
                testID="navigatorContainer"
                style={{ flex: 1 }}>
                {inner}
            </View>
        );
    }
}

RouteNavigator.propTypes = {
    routes: PropTypes.any.isRequired
};
