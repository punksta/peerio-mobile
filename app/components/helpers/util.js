const Util = {
    pinEntropyCheck(pin) {
        if (pin.match(/0{6}|1{6}|2{6}|3{6}|4{6}|5{6}|6{6}|7{6}|8{6}|9{6}/)
            || pin.match(/012345|123456|234567|345678|456789|543210|654321|765432|876543|98765/)) return false;
        return true;
    }
};

export default Util;
