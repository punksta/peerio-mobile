import { Keyboard, Dimensions } from 'react-native';
import moment from 'moment';
import { observable, action, reaction, when } from 'mobx';
import translator from 'peerio-translator';
import locales from '../../lib/locales';
import { TinyDb, PhraseDictionary } from '../../lib/icebear';
import RoutedState from '../routes/routed-state';

const { height } = Dimensions.get('window');

class UIState extends RoutedState {
    defaultCountrySelected = 'AU';

    @observable isFirstLogin = false;
    @observable focusedTextBox = null;
    @observable picker = null;
    @observable pickerVisible = false;
    @observable keyboardVisible = false;
    @observable keyboardHeight = 0;
    @observable locale = null;
    @observable pickerHeight = 200;
    @observable languageSelected = 'en';
    @observable appState = 'active';
    @observable debugText = 'test';
    @observable showDebugMenu = false;
    @observable externalViewer = false;
    @observable currentScrollView = null;
    @observable currentScrollViewPosition = 0;
    @observable customOverlayComponent = null;
    @observable trustDevice2FA = false;
    @observable languages = {
        en: `English`
        // fr: `French`,
        // es: `Spanish`,
        // ru: `Russian`
    };
    @observable countrySelected = this.defaultCountrySelected;
    @observable countries = {
        AD: 'Andorra',
        AE: 'United Arab Emirates',
        AF: 'Afghanistan',
        AG: 'Antigua and Barbuda',
        AI: 'Anguilla',
        AL: 'Albania',
        AM: 'Armenia',
        AO: 'Angola',
        AQ: 'Antarctica',
        AR: 'Argentina',
        AS: 'American Samoa',
        AT: 'Austria',
        AU: 'Australia',
        AW: 'Aruba',
        AX: 'Aland Islands',
        AZ: 'Azerbaijan',
        BA: 'Bosnia and Herzegovina',
        BB: 'Barbados',
        BD: 'Bangladesh',
        BE: 'Belgium',
        BF: 'Burkina Faso',
        BG: 'Bulgaria',
        BH: 'Bahrain',
        BI: 'Burundi',
        BJ: 'Benin',
        BL: 'Saint Barthelemy',
        BM: 'Bermuda',
        BN: 'Brunei',
        BO: 'Bolivia',
        BQ: 'Bonaire, Saint Eustatius and Saba ',
        BR: 'Brazil',
        BS: 'Bahamas',
        BT: 'Bhutan',
        BV: 'Bouvet Island',
        BW: 'Botswana',
        BY: 'Belarus',
        BZ: 'Belize',
        CA: 'Canada',
        CC: 'Cocos Islands',
        CD: 'Democratic Republic of the Congo',
        CF: 'Central African Republic',
        CG: 'Republic of the Congo',
        CH: 'Switzerland',
        CI: 'Ivory Coast',
        CK: 'Cook Islands',
        CL: 'Chile',
        CM: 'Cameroon',
        CN: 'China',
        CO: 'Colombia',
        CR: 'Costa Rica',
        CU: 'Cuba',
        CV: 'Cape Verde',
        CW: 'Curacao',
        CX: 'Christmas Island',
        CY: 'Cyprus',
        CZ: 'Czech Republic',
        DE: 'Germany',
        DJ: 'Djibouti',
        DK: 'Denmark',
        DM: 'Dominica',
        DO: 'Dominican Republic',
        DZ: 'Algeria',
        EC: 'Ecuador',
        EE: 'Estonia',
        EG: 'Egypt',
        EH: 'Western Sahara',
        ER: 'Eritrea',
        ES: 'Spain',
        ET: 'Ethiopia',
        FI: 'Finland',
        FJ: 'Fiji',
        FK: 'Falkland Islands',
        FM: 'Micronesia',
        FO: 'Faroe Islands',
        FR: 'France',
        GA: 'Gabon',
        GB: 'United Kingdom',
        GD: 'Grenada',
        GE: 'Georgia',
        GF: 'French Guiana',
        GG: 'Guernsey',
        GH: 'Ghana',
        GI: 'Gibraltar',
        GL: 'Greenland',
        GM: 'Gambia',
        GN: 'Guinea',
        GP: 'Guadeloupe',
        GQ: 'Equatorial Guinea',
        GR: 'Greece',
        GS: 'South Georgia and the South Sandwich Islands',
        GT: 'Guatemala',
        GU: 'Guam',
        GW: 'Guinea-Bissau',
        GY: 'Guyana',
        HK: 'Hong Kong',
        HM: 'Heard Island and McDonald Islands',
        HN: 'Honduras',
        HR: 'Croatia',
        HT: 'Haiti',
        HU: 'Hungary',
        ID: 'Indonesia',
        IE: 'Ireland',
        IL: 'Israel',
        IM: 'Isle of Man',
        IN: 'India',
        IO: 'British Indian Ocean Territory',
        IQ: 'Iraq',
        IR: 'Iran',
        IS: 'Iceland',
        IT: 'Italy',
        JE: 'Jersey',
        JM: 'Jamaica',
        JO: 'Jordan',
        JP: 'Japan',
        KE: 'Kenya',
        KG: 'Kyrgyzstan',
        KH: 'Cambodia',
        KI: 'Kiribati',
        KM: 'Comoros',
        KN: 'Saint Kitts and Nevis',
        KP: 'North Korea',
        KR: 'South Korea',
        KW: 'Kuwait',
        KY: 'Cayman Islands',
        KZ: 'Kazakhstan',
        LA: 'Laos',
        LB: 'Lebanon',
        LC: 'Saint Lucia',
        LI: 'Liechtenstein',
        LK: 'Sri Lanka',
        LR: 'Liberia',
        LS: 'Lesotho',
        LT: 'Lithuania',
        LU: 'Luxembourg',
        LV: 'Latvia',
        LY: 'Libya',
        MA: 'Morocco',
        MC: 'Monaco',
        MD: 'Moldova',
        ME: 'Montenegro',
        MF: 'Saint Martin',
        MG: 'Madagascar',
        MH: 'Marshall Islands',
        MK: 'Macedonia',
        ML: 'Mali',
        MM: 'Myanmar',
        MN: 'Mongolia',
        MO: 'Macao',
        MP: 'Northern Mariana Islands',
        MQ: 'Martinique',
        MR: 'Mauritania',
        MS: 'Montserrat',
        MT: 'Malta',
        MU: 'Mauritius',
        MV: 'Maldives',
        MW: 'Malawi',
        MX: 'Mexico',
        MY: 'Malaysia',
        MZ: 'Mozambique',
        NA: 'Namibia',
        NC: 'New Caledonia',
        NE: 'Niger',
        NF: 'Norfolk Island',
        NG: 'Nigeria',
        NI: 'Nicaragua',
        NL: 'Netherlands',
        NO: 'Norway',
        NP: 'Nepal',
        NR: 'Nauru',
        NU: 'Niue',
        NZ: 'New Zealand',
        OM: 'Oman',
        PA: 'Panama',
        PE: 'Peru',
        PF: 'French Polynesia',
        PG: 'Papua New Guinea',
        PH: 'Philippines',
        PK: 'Pakistan',
        PL: 'Poland',
        PM: 'Saint Pierre and Miquelon',
        PN: 'Pitcairn',
        PR: 'Puerto Rico',
        PS: 'Palestinian Territory',
        PT: 'Portugal',
        PW: 'Palau',
        PY: 'Paraguay',
        QA: 'Qatar',
        RE: 'Reunion',
        RO: 'Romania',
        RS: 'Serbia',
        RU: 'Russia',
        RW: 'Rwanda',
        SA: 'Saudi Arabia',
        SB: 'Solomon Islands',
        SC: 'Seychelles',
        SD: 'Sudan',
        SE: 'Sweden',
        SG: 'Singapore',
        SH: 'Saint Helena',
        SI: 'Slovenia',
        SJ: 'Svalbard and Jan Mayen',
        SK: 'Slovakia',
        SL: 'Sierra Leone',
        SM: 'San Marino',
        SN: 'Senegal',
        SO: 'Somalia',
        SR: 'Suriname',
        SS: 'South Sudan',
        ST: 'Sao Tome and Principe',
        SV: 'El Salvador',
        SX: 'Sint Maarten',
        SY: 'Syria',
        SZ: 'Swaziland',
        TC: 'Turks and Caicos Islands',
        TD: 'Chad',
        TF: 'French Southern Territories',
        TG: 'Togo',
        TH: 'Thailand',
        TJ: 'Tajikistan',
        TK: 'Tokelau',
        TL: 'East Timor',
        TM: 'Turkmenistan',
        TN: 'Tunisia',
        TO: 'Tonga',
        TR: 'Turkey',
        TT: 'Trinidad and Tobago',
        TV: 'Tuvalu',
        TW: 'Taiwan',
        TZ: 'Tanzania',
        UA: 'Ukraine',
        UG: 'Uganda',
        UM: 'United States Minor Outlying Islands',
        US: 'United States',
        UY: 'Uruguay',
        UZ: 'Uzbekistan',
        VA: 'Vatican',
        VC: 'Saint Vincent and the Grenadines',
        VE: 'Venezuela',
        VG: 'British Virgin Islands',
        VI: 'U.S. Virgin Islands',
        VN: 'Vietnam',
        VU: 'Vanuatu',
        WF: 'Wallis and Futuna',
        WS: 'Samoa',
        XK: 'Kosovo',
        YE: 'Yemen',
        YT: 'Mayotte',
        ZA: 'South Africa',
        ZM: 'Zambia',
        ZW: 'Zimbabwe'
    };
    @observable roles = {
        doctor: 'Doctor',
        admin: 'Admin'
    };
    @observable roleSelected = '';
    @observable specialties = {
        'Addiction Medicine': 'Addiction Medicine',
        'Aged Care / Geriatric Medicine': 'Aged Care / Geriatric Medicine',
        'Allergy Medicine': 'Allergy Medicine',
        Anaesthetics: 'Anaesthetics',
        'Cardiac Surgery': 'Cardiac Surgery',
        Cardiology: 'Cardiology',
        'Cardiothoracic Surgery': 'Cardiothoracic Surgery',
        'Colorectal Surgery': 'Colorectal Surgery',
        'Emergency Medicine': 'Emergency Medicine',
        'Endocrine Surgery': 'Endocrine Surgery',
        Endocrinology: 'Endocrinology',
        'ENT / Otolaryngology': 'ENT / Otolaryngology',
        'Facio-Maxillary / Oral Surgery': 'Facio-Maxillary / Oral Surgery',
        'Family Medicine / General Practice': 'Family Medicine / General Practice',
        Gastroenterology: 'Gastroenterology',
        'Gastrointestinal Surgery': 'Gastrointestinal Surgery',
        'General Medicine': 'General Medicine',
        'General Surgery': 'General Surgery',
        Haematology: 'Haematology',
        'Infectious Diseases': 'Infectious Diseases',
        'Intensive Care Medicine': 'Intensive Care Medicine',
        Neonatology: 'Neonatology',
        Neurology: 'Neurology',
        Neurosurgery: 'Neurosurgery',
        'Nuclear Medicine': 'Nuclear Medicine',
        'Obstetrics and Gynaecology': 'Obstetrics and Gynaecology',
        'Occupational Medicine': 'Occupational Medicine',
        Oncology: 'Oncology',
        Ophthalmology: 'Ophthalmology',
        'Orthopaedic Surgery': 'Orthopaedic Surgery',
        Paediatrics: 'Paediatrics',
        'Palliative Care Medicine': 'Palliative Care Medicine',
        Pathology: 'Pathology',
        'Plastic Surgery': 'Plastic Surgery',
        Psychiatry: 'Psychiatry',
        'Public Health': 'Public Health',
        'Radiation Oncology': 'Radiation Oncology',
        Radiology: 'Radiology',
        'Rehabilitation Medicine': 'Rehabilitation Medicine',
        'Renal Medicine': 'Renal Medicine',
        'Respiratory Medicine': 'Respiratory Medicine',
        Rheumatology: 'Rheumatology',
        'Sexual Health / GUM': 'Sexual Health / GUM',
        'Surgical Related': 'Surgical Related',
        'Thoracic Surgery': 'Thoracic Surgery',
        'Transplant Surgery': 'Transplant Surgery',
        Trauma: 'Trauma',
        Urology: 'Urology',
        'Vascular Surgery': 'Vascular Surgery'
    };
    @observable specialtySelected = '';

    get bottomOffset() {
        const pickerHeight = this.pickerVisible ? this.pickerHeight : 0;
        return this.keyboardHeight || pickerHeight;
    }

    @action focusTextBox(textbox) {
        this.focusedTextBox = textbox;
    }

    @action showPicker(picker) {
        this.hideKeyboard();
        this.picker = picker;
        setTimeout(() => { this.pickerVisible = true; }, 0);
    }

    @action hidePicker() {
        this.hideKeyboard();
    }

    @action hideKeyboard() {
        Keyboard.dismiss();
        setTimeout(() => { this.pickerVisible = false; }, 0);
    }

    @action.bound hideAll() {
        this.hideKeyboard();
        this.hidePicker();
        return new Promise(resolve => when(() => this.keyboardHeight === 0, resolve));
    }

    @action setLocale(lc) {
        return locales.loadLocaleFile(lc)
            .then(locale => {
                console.log(`ui-state.js: ${lc}`);
                console.log(lc);
                translator.setLocale(lc, locale);
                this.locale = lc;
                this.languageSelected = lc;
                this.save();
                moment.locale(lc);
            })
            .then(() => locales.loadDictFile(lc))
            .then(dictString => {
                PhraseDictionary.setDictionary(this.locale, dictString);
            });
    }

    @action load() {
        return TinyDb.system.getValue('state')
            .then(s => this.setLocale(s && s.locale || 'en'));
    }

    @action save() {
        const locale = this.locale || 'en';
        return TinyDb.system.setValue('state', { locale });
    }

    @action scrollToTextBox() {
        const { focusedTextBox, currentScrollView, keyboardHeight } = this;
        if (focusedTextBox && currentScrollView) {
            const y = focusedTextBox.offsetY - (height - keyboardHeight) + focusedTextBox.offsetHeight + this.currentScrollViewPosition;
            if (y > 0) {
                console.log(`scroll to ${y}, for ${focusedTextBox.offsetY}, ${this.currentScrollViewPosition}`);
                currentScrollView.scrollTo({ y, animated: true });
                when(() => this.keyboardHeight === 0, () => currentScrollView.scrollTo({ y: 0, animated: true }));
            }
        }
    }
}

const uiState = new UIState();

reaction(() => uiState.languageSelected, ls => uiState.setLocale(ls));

reaction(() => uiState.keyboardHeight, () => uiState.scrollToTextBox());

reaction(() => uiState.focusedTextBox, () => {
    const { focusedTextBox } = uiState;
    if (focusedTextBox) {
        uiState.pickerVisible = false;
        uiState.scrollToTextBox();
    }
});

Keyboard.addListener('keyboardWillShow', (e) => {
    uiState.keyboardHeight = e.endCoordinates.height;
});

Keyboard.addListener('keyboardDidShow', (e) => {
    uiState.keyboardHeight = e.endCoordinates.height;
    console.log(`ui-state.js: keyboard height ${uiState.keyboardHeight}`);
});

Keyboard.addListener('keyboardWillHide', () => {
    uiState.keyboardHeight = 0;
});

Keyboard.addListener('keyboardDidHide', () => {
    uiState.keyboardHeight = 0;
});

uiState.height = height;

export default uiState;
