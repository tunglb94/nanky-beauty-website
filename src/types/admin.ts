import React from 'react';

// Định nghĩa cấu trúc của state 'content' để dễ quản lý
export interface ContentState {
    header: any;
    hero: any;
    why_us: { cards: any[], title: string, subtitle: string };
    materials: { sections: any[], title: string, description: string };
    cta_final: any;
    testimonials_title: string;
    [key: string]: any;
}

// Định nghĩa props dùng chung cho tất cả các component Editor
export interface AdminEditorProps {
    lang: string;
    activeSection: string;
    content: ContentState;
    updateContent: (path: (string | number)[], value: string | null) => void;
    handleSave: () => void;
    isLoading: boolean;
    status: string;
    setStatus: (status: string) => void;
    isRaw: boolean;
    setIsRaw: (isRaw: boolean) => void;
    rawContent: string;
    setRawContent: (rawContent: string) => void;
    // Hàm đồng bộ ảnh cho tất cả các ngôn ngữ
    syncImageAcrossLanguages: (path: (string | number)[], newUrl: string) => Promise<void>;
}