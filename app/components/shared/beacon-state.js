import React from 'react';
import { action, observable, computed } from 'mobx';

const beaconContext = {
    onboarding: [
        'mobile-chat-icon',
        'mobile-create-dm',
        'mobile-upload-file',
        'mobile-contacts-icon',
        'mobile-contacts-search'
    ]
};

const beaconLabels = {
    'mobile-chat-icon': {
        textHeader: 'See all your conversations here.',
        textLine1: 'Start a new conversation or check-in on your direct messages and rooms.'
    },
    'mobile-contacts-icon': {
        textHeader: 'See all your contacts here.',
        textLine1: 'Invite people or see who already uses peerio in your contacts.'
    }
};

class BeaconState {
    @observable.shallow beacons = [];

    requestBeacons(beacon) {
        console.log('>>> Requested beacons', beacon);
        beacon.beaconText = beaconLabels[beacon.id];
        this.beacons.unshift(beacon);
    }

    @action.bound
    clearBeacons() {
        this.beacons = [];
    }

    @action.bound
    removeBeacon(id) {
        this.beacons = this.beacons.filter(beacon => beacon.id !== id);
    }
}

const beaconState = new BeaconState();

export default beaconState;
