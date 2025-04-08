class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.availableLanguages = {
            'en': 'English',
            'sv': 'Svenska',
            'de': 'Deutsch',
            'ru': 'Русский',
            'pl': 'Polska',
            'ro': 'Romanesc',
            'pt': 'Português',
            'jp': '日本語',
            'es': 'Español',
            'no': 'Norsk',
            'zh': '中文'
        };
    }

    async init() {
        // Get language from HTML tag (set by PowerShell)
        this.currentLanguage = document.documentElement.lang || 'en';
        
        // Fallback to English if language not available
        if (!this.availableLanguages[this.currentLanguage]) {
            this.currentLanguage = 'en';
        }
        
        await this.loadTranslations();
    }

    async loadTranslations() {
        try {
            // Load all translation files for current language
            const [menus, characters, music, spells] = await Promise.all([
                this.loadTranslationFile('menus'),
                this.loadTranslationFile('characters'),
                this.loadTranslationFile('music'),
                this.loadTranslationFile('spells')
            ]);
            
            this.translations = {
                menus,
                characters,
                music,
                spells
            };
            
            // If any translation failed, fall back to English
            if (Object.keys(this.translations.menus).length === 0 && 
                this.currentLanguage !== 'en') {
                console.warn(`Translations incomplete for ${this.currentLanguage}, falling back to English`);
                this.currentLanguage = 'en';
                await this.loadTranslations();
            }
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English if loading fails
            if (this.currentLanguage !== 'en') {
                this.currentLanguage = 'en';
                await this.loadTranslations();
            }
        }
    }

    async loadTranslationFile(fileType) {
        const response = await fetch(`lang/${this.currentLanguage}/${fileType}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${fileType} translations`);
        }
        return await response.json();
    }

    async setLanguage(langCode) {
        if (this.availableLanguages[langCode] && langCode !== this.currentLanguage) {
            this.currentLanguage = langCode;
            document.documentElement.lang = langCode;
            await this.loadTranslations();
        }
    }

    getText(keyPath, fallback = '') {
        // Split key path into parts (e.g. "menus.mainMenu.start")
        const parts = keyPath.split('.');
        let current = this.translations;
        
        for (const part of parts) {
            if (!current || typeof current !== 'object' || !(part in current)) {
                console.warn(`Translation not found: ${keyPath}`);
                return fallback;
            }
            current = current[part];
        }
        
        return current || fallback;
    }
}

const languageManager = new LanguageManager();
window.languageManager = languageManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    languageManager.init().then(() => {
        console.log('Translations loaded');
    });
});