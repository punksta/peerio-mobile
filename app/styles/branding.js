const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';
console.log(`Branding ${EN}`);

const brandingDefines = {
    name: EN,
    peeriomobile: {
        bg: '#2C95CF',
        bgGradient: '#32CEC3',
        tabsBg: '#f7f7f7',
        tabsFg: '#757575',
        logo: require('../assets/logo-with-tag.png'),
        peerioBlue: '#408CFF',
        yellow: '#FDC700'
    },
    expandoo: {
        bg: '#009dfd',
        bgGradient: '#009dfd',
        tabsBg: '#f7f7f7',
        tabsFg: '#757575',
        logo: require('../assets/expandoo-logo-white.png')
    }
};

const branding = brandingDefines[EN];
branding.name = EN;

export default branding;
