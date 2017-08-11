import { observable } from 'mobx';
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
Unlimited Message Archive
Premium support
`;

const premiumPaymentInfo =
`
Monthly plans will be charged $3.99 USD each month.

Annual plans will be charged $34.99 USD each year.

These prices may vary according to your location and local currency.

Your subscription will renew automatically at the end of each billing period unless you disable auto-renew at least 24-hours before the end of your current billing period. If your subscription is renewed, your account will be charged for renewal within 24-hours prior to the end of the current period.
`;

const professionalIncludesInfo =
`Includes features of Premium and Basic Plans`;

const professionalPlanInfo =
`500 GB of secure storage
Unlimited upload file size
Unlimited Message Archive
Premium support
`;

const professionalPaymentInfo =
`
Monthly plans will be charged $12.99 USD each month.

Annual plans will be charged $118.99 USD each year.

These prices may vary according to your location and local currency.

Your subscription will renew automatically at the end of each billing period unless you disable auto-renew at least 24-hours before the end of your current billing period. If your subscription is renewed, your account will be charged for renewal within 24-hours prior to the end of the current period.
`;

const { premiumYearlyID, premiumMonthlyID, professionalYearlyID, professionalMonthlyID }
    = payments;

const serverPlans = [
    'icebear_premium_monthly',
    'icebear_premium_monthly',
    'icebear_pro_monthly',
    'icebear_pro_yearly'
];

function getActivePlans() {
    return User.current ? User.current.activePlans : [];
}

class BasicPlan {
    title = 'Basic';
    price = 'Free';
    info = basicPlanInfo;
    storage = '1 GB';
    uploadFileSize = '500 MB';
    canUpgradeTo = false;
    isFreePlan = true;

    get isCurrent() {
        return getActivePlans().filter(p => serverPlans.indexOf(p) !== -1).length === 0;
    }

    setDefaultSelected = () => {};
}

class PaidPlan {
    @observable selected;

    get intersectServer() {
        return this.priceOptions.filter(p => getActivePlans().indexOf(p.serverID) !== -1);
    }

    get isCurrent() {
        return !!this.intersectServer.length;
    }

    get canUpgradeTo() {
        return getActivePlans().filter(p => serverPlans.indexOf(p) !== -1).length === 0;
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
        title: 'Billed monthly',
        id: premiumMonthlyID,
        serverID: 'icebear_premium_monthly',
        price: '$3.99 USD/month'
    }, {
        title: 'Billed annually',
        id: premiumYearlyID,
        serverID: 'icebear_premium_yearly',
        price: '$2.99 USD/month'
    }];
    includes = premiumIncludesInfo;
    info = premiumPlanInfo;
    selected = premiumYearlyID;
    paymentInfo = premiumPaymentInfo;
}

class ProfessionalPlan extends PaidPlan {
    title = 'Pro';
    storage = '500 GB';
    uploadFileSize = 'Unlimited';
    priceOptions = [{
        title: 'Billed monthly',
        id: professionalMonthlyID,
        serverID: 'icebear_pro_monthly',
        price: '$12.99 USD/month'
    }, {
        title: 'Billed annually',
        id: professionalYearlyID,
        serverID: 'icebear_pro_yearly',
        price: '$9.99 USD/month'
    }];
    includes = professionalIncludesInfo;
    info = professionalPlanInfo;
    paymentInfo = professionalPaymentInfo;
}

const plans = [new BasicPlan(), new PremiumPlan(), new ProfessionalPlan()];

plans.topPlan = function() {
    const p = plans.filter(s => s.isCurrent && !s.isFreePlan);
    return p.length ? p[p.length - 1] : null;
};

plans.topPlanIndex = function() {
    let result = -1;
    for (let i = 0; i < plans.length; ++i) {
        const s = plans[i];
        if (s.isCurrent && !s.isFreePlan) result = i;
    }
    return result;
};

plans.userHasPaidPlan = function() {
    return !!plans.topPlan();
};

export default plans;
