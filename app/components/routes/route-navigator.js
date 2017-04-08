import React, { Component } from 'react';
import { View, Navigator } from 'react-native';
import { reaction } from 'mobx';
import BgPattern from '../controls/bg-pattern';
import styles from '../../styles/styles';
import uiState from '../layout/ui-state';

export default class RouteNavigator extends Component {
    componentDidMount() {
        const routes = this.props.routes;
        this.bindRouteroutes = reaction(() => routes.route, route => {
            console.log(`route-navigator: ${routes.prevRoute}, ${route}`);

            const newIndex = routes.routesList.indexOf(route);
            const oldIndex = routes.routesList.indexOf(routes.prevRoute);
            routes.prevRoute = route;
            const rInfo = routes.routes[route];
            console.log(rInfo);
            requestAnimationFrame(uiState.hideKeyboard);
            if (rInfo.replace) {
                console.log('reset route stack');
                this.nav.immediatelyResetRouteStack([rInfo]);
                return;
            }
            if (newIndex === oldIndex - 1) {
                this.nav.pop();
            } else if (newIndex < oldIndex) {
                this.nav.jumpTo(rInfo);
            } else {
                this.nav.push(rInfo);
            }
        });
    }

    renderScene(route) {
        const inner = React.createElement(route.component);
        this.scene = inner;
        const hidden = { overflow: 'hidden' };
        return (
            <View
                testID={`route${route.key}Scene`}
                removeClippedSubviews={false}
                key={route.key}
                style={[styles.navigator.card, hidden]}>
                <BgPattern />
                {inner}
            </View>
        );
    }

    configureScene(/* route, routeStack */) {
        return Navigator.SceneConfigs.PushFromRight;
    }

    render() {
        return (
            <View
                testID="navigatorContainer"
                style={{ flex: 1 }}>
                <Navigator
                    testID="navigator"
                    ref={nav => (this.nav = nav)}
                    initialRoute={this.props.routes.first}
                    configureScene={(route, routeStack) => this.configureScene(route, routeStack)}
                    renderScene={route => this.renderScene(route)} />
            </View>
        );
    }
}

RouteNavigator.propTypes = {
    routes: React.PropTypes.any.isRequired
};
