import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import beaconState from './beacon-state';
import Beacon from './beacon';

const style = {
    position: 'absolute',
    top: 0,
    left: 0
};

@observer
export default class BeaconLayout extends SafeComponent {
    renderThrow() {
        if (!beaconState.beacons || !beaconState.beacons.length) return null;

        return (
            <View style={style}>
                {beaconState.beacons.map(beacon => <Beacon key={beacon.id} beacon={beacon} />)}
            </View>
        );
    }
}
