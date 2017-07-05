import { User } from '../../lib/icebear';

class PaymentsBase {
    get canUpgradeUser() {
        return true;
    }

    get showFileUpgradeOffer() {
        return this.canUpgradeUser && User.current.fileQuotaUsedPercent >= 0;
    }

    get showArchiveUpgradeOffer() {
        return this.canUpgradeUser;
    }

    purchase(/* id */) {
        throw new Error('must override');
    }

    test() {
        throw new Error('must override');
    }
}

export default PaymentsBase;
