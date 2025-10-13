// src/components/admin/ImageUploadGroup.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

const InputGroup = styled.div` margin-bottom: 10px; label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 0.9rem; } input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; } `;
const ImagePreviewContainer = styled.div` margin-top: 10px; `;
const ImagePreview = styled.img` max-width: 100px; height: auto; border-radius: 4px; border: 1px solid #ddd; `;
const UploadStatus = styled.p` font-size: 0.85rem; margin-top: 5px; font-weight: bold; &.error { color: #e74c3c; } &.success { color: #2ecc71; }`;

interface ImageUploadGroupProps {
    label: string;
    imageUrl: string;
    onUpdate: (newUrl: string) => void;
    uploadSubdir?: string; // Không dùng nhưng giữ để tránh lỗi TypeScript
    uniqueId: string; // Không dùng nhưng giữ để tránh lỗi TypeScript
    setStatus: (status: string) => void; // Không dùng nhưng giữ để tránh lỗi TypeScript
    isLoading: boolean; // Không dùng nhưng giữ để tránh lỗi TypeScript
}

// *** SỬA ĐỔI CHÍNH: CHỈ CHẤP NHẬN DÁN URL ***
const ImageUploadGroup: React.FC<ImageUploadGroupProps> = ({ label, imageUrl, onUpdate, setStatus, isLoading }) => {
    
    // Loại bỏ toàn bộ logic liên quan đến file upload (handleFileChange, isUploading, status)

    return (
        <InputGroup>
            <label>{label}</label>
            <input
                type="text"
                value={imageUrl}
                // *** CHỈ CẬP NHẬT TRẠNG THÁI KHI NGƯỜI DÙNG DÁN URL MỚI ***
                onChange={(e) => onUpdate(e.target.value)}
                placeholder="Dán URL ảnh công khai (Google Drive, Cloudinary, v.v...)"
            />
            
            <div style={{ marginTop: '10px' }}>
                <p style={{ color: '#007bff', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    ✅ Chế độ DÁN URL được BẬT.
                </p>
                <p style={{ color: '#777', fontSize: '0.85rem' }}>
                    Vui lòng tải ảnh lên dịch vụ lưu trữ và dán link trực tiếp.
                </p>
            </div>
            
            {/* Loại bỏ hoàn toàn nút chọn file và trạng thái upload */}
            
            {imageUrl && (
                <ImagePreviewContainer>
                    <ImagePreview src={imageUrl} alt="Xem trước" />
                </ImagePreviewContainer>
            )}
        </InputGroup>
    );
};

export default ImageUploadGroup;