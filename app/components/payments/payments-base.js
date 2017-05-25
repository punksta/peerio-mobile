class PaymentsBase {
    purchase(/* id */) {
        throw new Error('must override');
    }

    test() {
        throw new Error('must override');
    }
}

export default PaymentsBase;
