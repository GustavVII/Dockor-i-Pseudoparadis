// js/managers/languageManager.js
class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.availableLanguages = {
            'en': 'English',
            'sv': 'Svenska',
            'de': 'Deutsch',
            // Add more languages as needed
        };
        
        // Pre-loaded translation files
        this.translationFiles = {
            'en': window.enTranslations || {},
            'sv': window.svTranslations || {},
            'de': window.deTranslations || {}
        };
    }

    init() {
        // Set initial language from HTML lang attribute
        this.currentLanguage = document.documentElement.lang || 'en';
        
        // Validate language
        if (!this.availableLanguages[this.currentLanguage]) {
            this.currentLanguage = 'en';
        }
        
        // Load translations
        this.loadTranslations();
        return Promise.resolve();
    }

    loadTranslations() {
        this.translations = this.translationFiles[this.currentLanguage] || {};
        
        // Fallback to English if current language fails
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
        // Support nested keys like "mainMenu.start"
        return keyPath.split('.').reduce((obj, key) => 
            (obj && obj[key] !== undefined) ? obj[key] : fallback, 
            this.translations
        ) || fallback;
    }
}

const languageManager = new LanguageManager();
window.languageManager = languageManager;