import React from 'react';
import { action, observable } from 'mobx';

let lastBeaconId = 0;

class BeaconState {
    @observable.shallow beacons = [];

    requestBeacons(beacon, props) {
        console.log('>>> Requested beacons', beacon);

        lastBeaconId++;
        const propsParam = props || {};
        propsParam.beaconId = lastBeaconId;

        this.beacons.unshift({
            component: React.createElement(beacon, props),
            beaconId: lastBeaconId
        });
    }

    @action.bound
    removeBeacon(id) {
        this.beacons = this.beacons.filter(beacon => beacon.beaconId !== id);
    }

    @action.bound
    clearBeacons() {
        this.beacons = [];
    }
}

const beaconState = new BeaconState();

export default beaconState;
