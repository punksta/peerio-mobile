import medcryptor from './medcryptor/medcryptor-white-label-config';

const whiteLabelsConfigs = {
    medcryptor
};

/* const whiteLabelConfig = {
    stringReplacements: []
}; */

const whiteLabelConfig = whiteLabelsConfigs[process.env.APP_LABEL] || {};
global.whiteLabelConfig = whiteLabelConfig;
export default whiteLabelConfig;
