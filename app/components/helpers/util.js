const Util = {

    isValidUsername(name) {
        return !!name.match(/^\w{1,16}$/);
    },

    isNameValid(name) {
        return !name || !!name.match(/^[a-zа-яãâàâåáéèêëîïôûùüÿýçñæœößøòôõóìîíùûúà .\-']{1,20}$/i);
    },

    isValidEmail(val) {
        const emailRegex = new RegExp(/^[^ ]+@[^ ]+/i);
        return emailRegex.test(val);
    },

    isValidPhone(val) {
        const phoneRegex =
            new RegExp(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/i);
        return phoneRegex.test(val);
    },

    pinEntropyCheck(pin) {
        if (pin.match(/0{6}|1{6}|2{6}|3{6}|4{6}|5{6}|6{6}|7{6}|8{6}|9{6}/)
            || pin.match(/012345|123456|234567|345678|456789|543210|654321|765432|876543|98765/)) return false;
        return true;
    }
};

export default Util;
