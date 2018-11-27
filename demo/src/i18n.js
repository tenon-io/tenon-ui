import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import { str } from './pseudoloc';

const iterateAndChange = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && typeof obj[key] === 'object') {
            iterateAndChange(obj[key]);
            return;
        }
        if (typeof obj[key] === 'string') {
            obj[key] = str(obj[key]);
        }
    });
};

const parseFunc = (data, url) => {
    const jsonData = JSON.parse(data);
    if (url.includes('/pseudo/')) {
        iterateAndChange(jsonData);
    }
    return jsonData;
};

const options = {
    parse: parseFunc
};

const xhr = new Backend(null, options);

i18n.use(xhr)
    .use(LanguageDetector)
    .use(reactI18nextModule)
    .init({
        fallbackLng: 'en',

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        debug: true,

        interpolation: {
            escapeValue: false // not needed for react!!
        },

        react: {
            wait: true
        }
    });

export default i18n;
