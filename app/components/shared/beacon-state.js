import { action, observable } from 'mobx';
import { User } from '../../lib/icebear';

const beaconContext = {
    onboarding: [
        'mobile-chat-icon',
        'mobile-create-dm',
        'mobile-upload-file',
        'mobile-contacts-icon',
        'mobile-contacts-search'
    ]
};
class BeaconState {
    @observable.shallow beacons = [];

    requestBeacons(beacon) {
        console.log('>>> Requested beacons', beacon, User.current.beacons, User.current.beacons.get(beacon.id));
        const seen = User.current.beacons.get(beacon.id);

        if (!seen) {
            this.addBeacon(beacon);
        }
    }

    @action.bound
    addBeacon(beacon) {
        this.beacons.unshift(beacon);
    }

    @action.bound
    removeBeacon(id) {
        this.beacons = this.beacons.filter(beacon => beacon.id !== id);
    }

    @action.bound
    clearBeacons() {
        this.beacons = [];
    }
}

const beaconState = new BeaconState();

export default beaconState;
