const ES = require('./es.json')
const EN = require('./en.json')

const getTranslations = (locale) => {
    const translations = {
        'en': EN, 
        'es': ES
    }
    return translations[locale] || translations['en']
}

module.exports = getTranslations