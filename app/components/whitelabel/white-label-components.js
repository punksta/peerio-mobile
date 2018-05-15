import * as medcryptor from './medcryptor-white-label-components';
import * as peerio from './peerio-white-label-components';

const whiteLabels = {
    medcryptor,
    peerio
};

const WhiteLabel = whiteLabels[process.env.APP_LABEL].default;

export default WhiteLabel;
