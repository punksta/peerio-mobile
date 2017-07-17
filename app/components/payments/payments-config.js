import { observable } from 'mobx';
import { tx, tu } from '../utils/translator';
import payments from '../payments/payments';
import { User } from '../../lib/icebear';

const basicPlanInfo =
`Secure Messaging
90 day message archives
Portability across devices
Secure File Storage & Sharing
1 GB of secure Peerio Vault storage
500M max upload file size`;

const premiumIncludesInfo =
`Includes features of Basic Plan`;

const premiumPlanInfo =
`20 GB of secure storage
2 GB max upload file size
Unlimited Message Archive`;

const professionalIncludesInfo =
`Includes features of Premium and Basic Plans`;

const professionalPlanInfo =
`500 GB of secure storage
Unlimited upload file size
Unlimited Message Archive`;

const { premiumYearlyID, premiumMonthlyID, professionalYearlyID, professionalMonthlyID }
    = payments;

class BasicPlan {
    title = 'Basic';
    price = 'Free';
    info = basicPlanInfo;
    storage = '1 GB';
    uploadFileSize = '500 MB';
    canUpgradeTo = false;

    get isCurrent() {
        return User.current.activePlans.length === 0;
    }

    setDefaultSelected = () => {};
}

class PaidPlan {
    @observable selected;

    get intersectServer() {
        return this.priceOptions.filter(p => User.current.activePlans.indexOf(p.serverID) !== -1);
    }

    get isCurrent() {
        return !!this.intersectServer.length;
    }

    get canUpgradeTo() {
        return User.current.activePlans.length === 0;
    }

    setDefaultSelected() {
        const activePlans = this.intersectServer;
        this.selected = activePlans.length ? activePlans[0].id : this.priceOptions[0].id;
    }
}

class PremiumPlan extends PaidPlan {
    title = 'Premium';
    storage = '20 GB';
    uploadFileSize = '2 GB';
    priceOptions = [{
        title: 'Billed annually',
        id: premiumYearlyID,
        serverID: 'icebear_premium_yearly',
        price: '$2.99/month'
    }, {
        title: 'Billed monthly',
        id: premiumMonthlyID,
        serverID: 'icebear_premium_monthly',
        price: '$3.99/month'
    }];
    includes = premiumIncludesInfo;
    info = premiumPlanInfo;
    selected = premiumYearlyID;
}

class ProfessionalPlan extends PaidPlan {
    title = 'Pro';
    storage = '500 GB';
    uploadFileSize = 'Unlimited';
    priceOptions = [{
        title: 'Billed annually',
        id: professionalYearlyID,
        serverID: 'icebear_pro_yearly',
        price: '$9.99/month'
    }, {
        title: 'Billed monthly',
        id: professionalMonthlyID,
        serverID: 'icebear_pro_monthly',
        price: '$12.99/month'
    }];
    includes = professionalIncludesInfo;
    info = professionalPlanInfo;
}

export default [new BasicPlan(), new PremiumPlan(), new ProfessionalPlan()];
