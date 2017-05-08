import vars from './vars';
import common from './common';

const { textInverse } = common;

export default {
    message: {
        text: textInverse,
        subTitle: [textInverse, {
            fontWeight: vars.font.weight.regular,
            fontSize: 22,
            marginTop: 12,
            marginBottom: 10
        }],
        container: {
            height: 50,
            justifyContent: 'space-between'
        }
    }
};
