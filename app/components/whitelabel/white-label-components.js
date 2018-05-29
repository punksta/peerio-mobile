import medcryptor from './medcryptor/medcryptor-white-label-components';
import peerio from './peerio/peerio-white-label-components';

const whiteLabels = {
    medcryptor,
    peerio
};

const whiteLabel = whiteLabels[process.env.APP_LABEL];

export default whiteLabel;
