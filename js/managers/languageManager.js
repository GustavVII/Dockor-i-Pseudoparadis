class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.availableLanguages = {
            'en': 'English',
            'sv': 'Svenska',
            'de': 'Deutsch',
            'ru': 'Русский',
            'pl': 'Polska'
            // fler språk
        };
        
        // Förinladda filer
        this.translationFiles = {
            'en': window.enTranslations || {},
            'sv': window.svTranslations || {},
            'de': window.deTranslations || {},
            'ru': window.ruTranslations || {},
            'pl': window.plTranslations || {}
        };
    }

    init() {
        // Leta efter dokumentets språk
        this.currentLanguage = document.documentElement.lang || 'en';
        
        // Om språk satt inte har filer...
        if (!this.availableLanguages[this.currentLanguage]) {
            this.currentLanguage = 'en'; // ...byt till engelska
        }
        
        this.loadTranslations();
        return Promise.resolve();
    }

    loadTranslations() {
        this.translations = this.translationFiles[this.currentLanguage] || {};
        
        // Ta engelska om språket inte finns (igen)
        if (Object.keys(this.translations).length === 0 && this.currentLanguage !== 'en') {
            console.warn(`No translations found for ${this.currentLanguage}, falling back to English`);
            this.currentLanguage = 'en';
            this.translations = this.translationFiles['en'] || {};
        }
    }

    setLanguage(langCode) {
        if (this.availableLanguages[langCode] && langCode !== this.currentLanguage) {
            this.currentLanguage = langCode;
            document.documentElement.lang = langCode;
            this.loadTranslations();
            return Promise.resolve();
        }
        return Promise.resolve();
    }

    getText(keyPath, fallback = '') {
        // Lösning för att hantera nyckar innuti nycklar (som "optionsMenu>>>.<<<title" där . deklarerar säger att leta efter nyckeln under kategorin deklarerad innan)
        return keyPath.split('.').reduce((obj, key) => 
            (obj && obj[key] !== undefined) ? obj[key] : fallback, 
            this.translations
        ) || fallback;
    }
}

const languageManager = new LanguageManager();
window.languageManager = languageManager;