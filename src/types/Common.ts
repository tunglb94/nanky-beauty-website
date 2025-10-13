// Định nghĩa các ngôn ngữ được hỗ trợ
export type Language = 'vi' | 'en' | 'ru' | 'kr';

// Định nghĩa cấu trúc của một mục Menu/Navigation
export interface NavItem {
    id: string;
    path: string;
    translationKey: string; // Key để tra cứu trong file locales
}

// Định nghĩa cấu trúc cơ bản cho các card (ví dụ: Why Us Card)
export interface FeatureCard {
    icon: string;
    title: string;
    description: string;
}

// Định nghĩa dữ liệu cho khu vực Testimonials
export interface Testimonial {
    name: string;
    quote: string;
    stars: 1 | 2 | 3 | 4 | 5;
}