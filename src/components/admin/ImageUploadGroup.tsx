import React, { useState } from 'react';
import styled from 'styled-components';

const InputGroup = styled.div` margin-bottom: 10px; label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 0.9rem; } input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; } `;
const Button = styled.button` background: #007bff; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; border: none; transition: all 0.3s; &:hover { background: #0056b3; } &:disabled { background: #ccc; } `;
const ImagePreviewContainer = styled.div` margin-top: 10px; `;
const ImagePreview = styled.img` max-width: 100px; height: auto; border-radius: 4px; border: 1px solid #ddd; `;
const UploadStatus = styled.p` font-size: 0.85rem; margin-top: 5px; font-weight: bold; &.error { color: #e74c3c; } &.success { color: #2ecc71; }`;

interface ImageUploadGroupProps {
    label: string;
    imageUrl: string;
    onUpdate: (newUrl: string) => void;
    uploadSubdir?: string;
    uniqueId: string; // <-- THÊM PROP MỚI
}

const ImageUploadGroup: React.FC<ImageUploadGroupProps> = ({ label, imageUrl, onUpdate, uploadSubdir = 'uploads', uniqueId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState({ message: '', isError: false });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('destination', uploadSubdir);

        setIsUploading(true);
        setStatus({ message: 'Đang tải lên...', isError: false });

        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Lỗi không xác định từ server');
            
            onUpdate(data.url); // Cập nhật URL mới cho component cha
            setStatus({ message: 'Upload thành công!', isError: false });
        } catch (error: any) {
            setStatus({ message: `Lỗi: ${error.message}`, isError: true });
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input file
        }
    };

    const fileInputId = `file-upload-${uniqueId}`; // <-- TẠO ID DUY NHẤT

    return (
        <InputGroup>
            <label>{label}</label>
            <input
                type="text"
                value={imageUrl}
                onChange={(e) => onUpdate(e.target.value)}
                placeholder="Dán URL hoặc upload ảnh bên dưới"
            />
            <div style={{ marginTop: '10px' }}>
                <input
                    type="file"
                    id={fileInputId} // <-- SỬ DỤNG ID DUY NHẤT
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={isUploading}
                />
                <Button as="label" htmlFor={fileInputId} style={{ cursor: 'pointer' }}> 
                    {isUploading ? 'Đang xử lý...' : 'Chọn & Upload Ảnh'}
                </Button>
            </div>
            
            {status.message && <UploadStatus className={status.isError ? 'error' : 'success'}>{status.message}</UploadStatus>}
            
            {imageUrl && (
                <ImagePreviewContainer>
                    <ImagePreview src={imageUrl} alt="Xem trước" />
                </ImagePreviewContainer>
            )}
        </InputGroup>
    );
};

export default ImageUploadGroup;