import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// ===============================================
// UI COMPONENTS (Đã thêm đầy đủ định nghĩa Styled Components)
// ===============================================

const SectionTitle = styled.h2`
    color: #222;
    border-bottom: 2px solid #C6A500;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-size: 1.8rem;
`;

const SectionBlock = styled(motion.div)`
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: #f9f9f9;
`;

const InputGroup = styled.div`
    margin-bottom: 15px;
    label {
        display: block;
        font-weight: 600;
        margin-bottom: 5px;
        color: #555;
    }
    input, textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }
    textarea {
        min-height: 80px;
        resize: vertical;
    }
`;

const RemoveButton = styled.button`
    background: #e74c3c;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-left: 10px;
`;

const SaveButton = styled.button`
  background: #C6A500;
  color: white;
  padding: 10px 30px;
  border-radius: 25px;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;

  &:hover {
    background: #FFD700;
  }
`;

const AddButton = styled(SaveButton)`
    background: #3498db; 
    padding: 8px 15px;
    margin-top: 0;
`;


const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const RawToggle = styled.button`
    background: #333;
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
`;

const ImagePreview = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
    img {
        width: 100px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #C6A500;
    }
`;

const EditorArea = styled.textarea`
    width: 100%;
    min-height: 400px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    font-family: monospace;
    margin-bottom: 20px;
    resize: vertical;
`;

// ===============================================
// HELPER COMPONENT (Image Upload Group)
// ===============================================

interface ImageUploadGroupProps {
    label: string;
    imageUrl: string;
    onUploadSuccess: (newUrl: string) => void;
    onTextChange: (newUrl: string) => void;
    uploadSubdir: string; 
    // Các props bổ sung từ component cha để xử lý trạng thái loading/status
    setStatus: (status: string) => void; 
    isLoading: boolean;
}

const ImageUploadGroup: React.FC<ImageUploadGroupProps> = ({ label, imageUrl, onUploadSuccess, onTextChange, uploadSubdir, setStatus, isLoading }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('destination', uploadSubdir); 

        setIsUploading(true);
        setUploadStatus('Đang upload...');

        fetch('/api/upload-image', { 
            method: 'POST',
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                onUploadSuccess(data.url); 
                setUploadStatus(`Upload thành công! URL: ${data.url}`);
            } else {
                setUploadStatus(`LỖI UPLOAD: ${data.error || 'Server error'}`);
                setStatus(`LỖI UPLOAD: ${data.error || 'Server error'}`); // Cập nhật trạng thái cha
            }
        })
        .catch(() => {
            setUploadStatus('LỖI MẠNG: Không thể kết nối API upload.');
            setStatus('LỖI MẠNG: Không thể kết nối API upload.'); // Cập nhật trạng thái cha
        })
        .finally(() => {
            setIsUploading(false);
            e.target.value = ''; 
            setTimeout(() => setUploadStatus(''), 5000);
        });
    };

    return (
        <InputGroup>
            <label>{label}</label>
            <input 
                type="text" 
                placeholder="Hoặc dán URL ảnh tại đây"
                value={imageUrl || ''}
                onChange={(e) => onTextChange(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                <label style={{ margin: 0 }}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        disabled={isUploading || isLoading}
                        style={{ display: 'none' }}
                    />
                    <SaveButton as="span" disabled={isUploading || isLoading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                        {isUploading ? 'Đang tải...' : `UPLOAD (${uploadSubdir.toUpperCase()})`}
                    </SaveButton>
                </label>
                <ImagePreview>
                    {imageUrl && <img src={imageUrl} alt="Preview" />}
                </ImagePreview>
            </div>
            {uploadStatus && <p style={{ color: uploadStatus.startsWith('LỖI') ? 'red' : 'green', fontSize: '0.9rem', marginTop: '5px' }}>{uploadStatus}</p>}
        </InputGroup>
    );
};
// END Image Upload Group


// ===============================================
// MAIN SERVICES EDITOR LOGIC
// ===============================================

interface AdminEditorProps {
    lang: string;
    activeSection: string;
    content: any;
    updateContent: (path: (string | number)[], value: string | null) => void;
    handleSave: () => void;
    isLoading: boolean;
    status: string;
    setStatus: (status: string) => void; // <-- Khai báo setStatus chính xác
    isRaw: boolean;
    setIsRaw: (isRaw: boolean) => void;
    rawContent: string;
    setRawContent: (rawContent: string) => void;
}

const AdminServicesEditor: React.FC<AdminEditorProps> = ({ lang, activeSection, content, updateContent, handleSave, isLoading, status, setStatus, isRaw, setIsRaw, rawContent, setRawContent }) => {

    const DEFAULT_NUM_SERVICES = 4;

    // Lấy keys dịch vụ hiện tại
    const getCurrentServiceKeys = () => {
        let keys: number[] = [];
        let i = 0;
        while(content && (content[`service_${i}_title`] || content[`service_${i}_desc`] || content[`service_${i}_price`])) {
            keys.push(i);
            i++;
        }
        if (keys.length === 0) {
            return [0, 1, 2, 3];
        }
        return keys;
    }
    
    // Xử lý Thêm Dịch Vụ Mới
    const handleAddService = () => {
        if (!content) return;
        
        const currentKeys = getCurrentServiceKeys();
        let newIndex = 0;
        while (currentKeys.includes(newIndex)) {
            newIndex++;
        }

        const newTitleKey = `service_${newIndex}_title`;
        const newDescKey = `service_${newIndex}_desc`;
        const newImageKey = `service_${newIndex}_imageUrl`;
        const newPriceKey = `service_${newIndex}_price`; 
        
        // Cập nhật Raw Content tạm thời
        const tempNewContent = JSON.parse(rawContent); 
        
        tempNewContent[newTitleKey] = `Dịch vụ mới ${newIndex}`;
        tempNewContent[newDescKey] = `Mô tả cho dịch vụ mới ${newIndex}`;
        tempNewContent[newImageKey] = `/images/services/service-new-${newIndex}.jpg`;
        tempNewContent[newPriceKey] = `Liên hệ`;

        setRawContent(JSON.stringify(tempNewContent, null, 2));
        setStatus(`Đã thêm dịch vụ mới: service_${newIndex} (Chỉ trong Editor). Vui lòng LƯU để áp dụng.`);
    };

    // Xử lý Xóa Dịch Vụ
    const handleRemoveService = (serviceIndex: number) => {
        if (!content) return;

        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ service_${serviceIndex} không?`);
        if (confirmDelete) {
            // Xóa các key liên quan. Dùng null để kích hoạt logic xóa key trong updateContent.
            updateContent([`service_${serviceIndex}_title`], null);
            updateContent([`service_${serviceIndex}_desc`], null);
            updateContent([`service_${serviceIndex}_imageUrl`], null);
            updateContent([`service_${serviceIndex}_price`], null);
            setStatus(`Đã xóa dịch vụ service_${serviceIndex}. Vui lòng LƯU để áp dụng.`);
        }
    };
    
    // Xử lý Upload ảnh dịch vụ
    const handleServiceImageUpdate = (serviceIndex: number, newUrl: string) => {
        updateContent([`service_${serviceIndex}_imageUrl`], newUrl);
    };


    const serviceKeys = getCurrentServiceKeys(); 

    const servicesData = serviceKeys.map((i) => ({
        titleKey: `service_${i}_title`,
        descKey: `service_${i}_desc`,
        imageKey: `service_${i}_imageUrl`,
        priceKey: `service_${i}_price`,
        defaultImageUrl: `/images/services/service-${i + 1}.jpg`, 
        index: i
    }));


    const renderServicesList = () => {
        // RENDER KHI activeSection LÀ ServiceList
        if (activeSection !== 'ServiceList') {
            return null;
        }

        return (
          <>
            <SectionTitle>Danh Sách Tất Cả Dịch Vụ</SectionTitle>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <AddButton onClick={handleAddService} disabled={isLoading}>+ Thêm Dịch Vụ Mới</AddButton>
            </div>
            
            {servicesData.map((service) => (
                <SectionBlock key={service.index} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #bbb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Tiêu đề hiển thị (sử dụng giá trị hiện tại từ content state) */}
                        <h5 style={{ color: '#C6A500', marginBottom: 10 }}>Dịch vụ {service.index + 1}: {content[service.titleKey] || `[service_${service.index}_title]`}</h5>
                        <RemoveButton 
                            onClick={() => handleRemoveService(service.index)}
                            disabled={isLoading}
                        >
                            Xóa Dịch Vụ
                        </RemoveButton>
                    </div>
                    
                    <InputGroup>
                        <label>Tiêu đề Dịch vụ</label>
                        <input type="text" value={content[service.titleKey] || ''} onChange={(e) => updateContent([service.titleKey], e.target.value)} disabled={isLoading} />
                    </InputGroup>
                    
                    <InputGroup>
                        <label>Mô tả Dịch vụ</label>
                        <textarea value={content[service.descKey] || ''} onChange={(e) => updateContent([service.descKey], e.target.value)} disabled={isLoading} />
                    </InputGroup>
                    
                    <InputGroup>
                        <label>Giá (Ví dụ: 600.000 VNĐ hoặc Liên hệ)</label>
                        <input type="text" value={content[service.priceKey] || ''} onChange={(e) => updateContent([service.priceKey], e.target.value)} disabled={isLoading} />
                    </InputGroup>
                    
                    <ImageUploadGroup 
                        label="URL Ảnh Dịch Vụ"
                        imageUrl={content[service.imageKey] || service.defaultImageUrl}
                        onUploadSuccess={(url) => handleServiceImageUpdate(service.index, url)}
                        onTextChange={(url) => updateContent([service.imageKey], url)}
                        uploadSubdir='services'
                        setStatus={setStatus} // Truyền setStatus xuống ImageUploadGroup
                        isLoading={isLoading}
                    />
                </SectionBlock>
            ))}
          </>
        );
    };


    // ===============================================
    // RENDER WRAPPER VÀ CONTROLS
    // ===============================================

    return (
        <div style={{ paddingBottom: '30px' }}>
            {/* --- ADMIN CONTROLS --- */}
            <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#222' }}>Danh Sách Dịch Vụ ({lang.toUpperCase()})</h1>
                <p style={{ color: status.startsWith('LỖI') ? 'red' : 'green', fontWeight: 'bold' }}>{status}</p>
            </div>

            <div style={{ padding: '20px 0' }}>
                <ButtonGroup style={{ justifyContent: 'flex-start', gap: '20px' }}>
                    <SaveButton onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Đang lưu...' : 'LƯU NỘI DUNG MỤC NÀY'}
                    </SaveButton>
                    <RawToggle onClick={() => setIsRaw(!isRaw)} disabled={isLoading}>
                        {isRaw ? '↩️ Quay lại UI' : '⚙️ Chỉnh sửa RAW JSON'}
                    </RawToggle>
                </ButtonGroup>
            </div>

            {/* RAW JSON EDITOR */}
            {isRaw && (
                <EditorArea
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    disabled={isLoading}
                />
            )}
            
            {/* STRUCTURED UI EDITOR */}
            {!isRaw && (
                <>{renderServicesList()}</>
            )}
        </div>
    );
};

export default AdminServicesEditor;