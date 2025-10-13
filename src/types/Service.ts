// Định nghĩa các loại hình dịch vụ cơ bản
export type ServiceType = 'classic' | 'volume' | 'hybrid' | 'custom';

// Định nghĩa cấu trúc của một dịch vụ nối mi
export interface Service {
    id: string;
    type: ServiceType;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
}