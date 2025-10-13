import React, { createContext, useContext, useState, useEffect } from 'react';

// CẦN IMPORT TẤT CẢ CÁC FILE NGÔN NGỮ
import vi from '../locales/vi.json'; 
import en from '../locales/en.json'; 
import ru from '../locales/ru.json'; 
import kr from '../locales/kr.json'; 
import zh from '../locales/zh.json'; // *** IMPORT MỚI ***

// Khai báo các resource ngôn ngữ
const langResources: { [key: string]: any } = {
    vi: vi,
    en: en,
    ru: ru,
    kr: kr,
    zh: zh, // *** ĐĂNG KÝ NGÔN NGỮ MỚI ***
};

// Định nghĩa Context State
interface I18nContextType {
    lang: string;
    t: (key: string) => string;
    changeLanguage: (newLang: string) => void;
    isLoaded: boolean; 
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// ------------------- Custom Hook useI18n -------------------
export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider'); 
    }
    return context;
};

// ------------------- Provider Component -------------------
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<string>('vi'); 
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    // 2. CHỈ TRUY CẬP LOCALSTORAGE SAU KHI COMPONENT ĐÃ MOUNT (Client-side)
    useEffect(() => {
        const storedLang = localStorage.getItem('nanky_lang');
        if (storedLang && langResources[storedLang]) { 
            setLang(storedLang);
        }
        setIsLoaded(true); 
    }, []);

    const changeLanguage = (newLang: string) => {
        if (langResources[newLang]) {
            setLang(newLang);
            localStorage.setItem('nanky_lang', newLang); 
        }
    };

    // Hàm dịch (translation function)
    const t = (key: string): any => {
        const parts = key.split('.');
        let data = langResources[lang];

        for (const part of parts) {
            if (!data || data[part] === undefined) { 
                // Fall-back về Tiếng Việt (ngôn ngữ mặc định)
                let fallbackData = langResources['vi'];
                let found = true;
                for (const fbPart of parts) {
                    if (!fallbackData || fallbackData[fbPart] === undefined) {
                        found = false;
                        break;
                    }
                    fallbackData = fallbackData[fbPart];
                }
                // Trả về dữ liệu fallback hoặc lỗi
                return found ? fallbackData : `[MISSING TRANSLATION: ${key}]`;
            }
            data = data[part];
        }
        return data; // Trả về giá trị (string, object, array)
    };

    return (
        <I18nContext.Provider value={{ lang, t, changeLanguage, isLoaded }}>
            {children}
        </I18nContext.Provider>
    );
};