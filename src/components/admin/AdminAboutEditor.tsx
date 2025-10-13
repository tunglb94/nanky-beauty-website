import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// ===============================================
// UI COMPONENTS (Giữ nguyên)
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

const AddButton = styled.button`
    background: #3498db;
    color: white;
    padding: 8px 15px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
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
}

const ImageUploadGroup: React.FC<ImageUploadGroupProps> = ({ label, imageUrl, onUploadSuccess, onTextChange, uploadSubdir }) => {
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
            }
        })
        .catch(() => {
            setUploadStatus('LỖI MẠNG: Không thể kết nối API upload.');
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
                        disabled={isUploading}
                        style={{ display: 'none' }}
                    />
                    <SaveButton as="span" disabled={isUploading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
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


// ===============================================
// MAIN EDITOR LOGIC
// ===============================================

interface AdminEditorProps {
    lang: string;
    activeSection: string;
    content: any;
    updateContent: (path: (string | number)[], value: string | null) => void;
    handleSave: () => void;
    isLoading: boolean;
    status: string;
    setStatus: (status: string) => void;
    isRaw: boolean;
    setIsRaw: (isRaw: boolean) => void;
    rawContent: string;
    setRawContent: (rawContent: string) => void;
}

const AdminAboutEditor: React.FC<AdminEditorProps> = ({ lang, activeSection, content, updateContent, handleSave, isLoading, status, isRaw, setIsRaw, rawContent, setRawContent }) => {

    const getNestedParsedArray = (path: string) => {
        const parts = path.split('.');
        let data = content;
        for (const part of parts) {
            data = data?.[part];
            if (data === undefined) return [];
        }
        
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                return [];
            }
        }
        return Array.isArray(data) ? data : [];
    };

    const pillars = getNestedParsedArray('about_page.pillars');
    const timeline = getNestedParsedArray('about_page.timeline'); // Lấy mảng timeline

    // ** HÀM CHUNG ĐỂ CẬP NHẬT MẢNG VÀ CHUỖI HÓA NGAY LẬP TỨC **
    const updateNestedArrayItem = (array: any[], arrayPath: string, index: number, key: string, value: string) => {
        const newArray = JSON.parse(JSON.stringify(array));
        if (newArray[index]) {
            newArray[index][key] = value;
            // Chuỗi hóa lại toàn bộ mảng và lưu vào JSON
            updateContent(arrayPath.split('.'), JSON.stringify(newArray, null, 2));
        }
    };

    // Logic update cho Pillars
    const updatePillar = (pillarIndex: number, subPath: string, value: string) => {
        if (subPath === 'milestones') {
             updateContent(['about_page', 'pillars', pillarIndex, subPath], value);
        } else {
             updateNestedArrayItem(pillars, 'about_page.pillars', pillarIndex, subPath, value);
        }
    };

    // Logic handle upload ảnh cho Pillar
    const handlePillarImageUpdate = (pillarIndex: number, newUrl: string) => {
        updateNestedArrayItem(pillars, 'about_page.pillars', pillarIndex, 'image', newUrl);
    };

    // ** LOGIC UPDATE CHO TIMELINE (DÙNG CHUỖI HÓA) **
    const updateTimelineItem = (timelineIndex: number, key: string, value: string) => {
        updateNestedArrayItem(timeline, 'about_page.timeline', timelineIndex, key, value);
    };
    
    // ** LOGIC XÓA SỰ KIỆN TIMELINE (DÙNG CHUỖI HÓA) **
    const removeTimelineEvent = (timelineIndex: number) => {
        const newTimeline = timeline.filter((_: any, i: number) => i !== timelineIndex);
        updateContent(['about_page', 'timeline'], JSON.stringify(newTimeline, null, 2));
    };


    // --- LOGIC RENDER ---

    const renderAboutSection = () => {
        switch (activeSection) {
            case 'HeroBanner':
                return (
                    <SectionBlock>
                        <SectionTitle>1. Hero Banner Trang Về Chúng Tôi</SectionTitle>
                        <InputGroup>
                            <label>Tiêu đề Phụ (Hero Subtitle)</label>
                            <input type="text" value={content.about_page?.hero_subtitle || ''} onChange={(e) => updateContent(['about_page', 'hero_subtitle'], e.target.value)} />
                        </InputGroup>
                        <ImageUploadGroup 
                            label="URL Ảnh Nền Hero"
                            imageUrl={content.about_page?.hero_image_url || '/images/about/about-hero-bg.jpg'}
                            onUploadSuccess={(url) => updateContent(['about_page', 'hero_image_url'], url)}
                            onTextChange={(url) => updateContent(['about_page', 'hero_image_url'], url)}
                            uploadSubdir='about'
                        />
                    </SectionBlock>
                );

            case 'Philosophy':
                return (
                    <SectionBlock>
                        <SectionTitle>2. Triết Lý & Sứ Mệnh</SectionTitle>
                        <InputGroup>
                            <label>Tiêu đề Triết Lý</label>
                            <input type="text" value={content.about_page?.philosophy_title || ''} onChange={(e) => updateContent(['about_page', 'philosophy_title'], e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <label>Nội dung Triết Lý</label>
                            <textarea value={content.about_page?.philosophy_text || ''} onChange={(e) => updateContent(['about_page', 'philosophy_text'], e.target.value)} />
                        </InputGroup>
                         <InputGroup>
                            <label>Sứ Mệnh</label>
                            <textarea value={content.about_page?.mission || ''} onChange={(e) => updateContent(['about_page', 'mission'], e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <label>Tầm Nhìn</label>
                            <textarea value={content.about_page?.vision || ''} onChange={(e) => updateContent(['about_page', 'vision'], e.target.value)} />
                        </InputGroup>
                        <ImageUploadGroup 
                            label="URL Ảnh Triết Lý"
                            imageUrl={content.about_page?.philosophy_image_url || '/images/about/philosophy-image.jpg'}
                            onUploadSuccess={(url) => updateContent(['about_page', 'philosophy_image_url'], url)}
                            onTextChange={(url) => updateContent(['about_page', 'philosophy_image_url'], url)}
                            uploadSubdir='about'
                        />
                    </SectionBlock>
                );

            case 'Pillars':
                return (
                    <SectionBlock>
                        <SectionTitle>3. 3 Trụ Cột Khác Biệt</SectionTitle>
                        <InputGroup>
                            <label>Tiêu đề Section</label>
                            <input type="text" value={content.about_page?.pillars_section_title || ''} onChange={(e) => updateContent(['about_page', 'pillars_section_title'], e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <label>Mô tả Section</label>
                            <textarea value={content.about_page?.pillars_section_subtitle || ''} onChange={(e) => updateContent(['about_page', 'pillars_section_subtitle'], e.target.value)} />
                        </InputGroup>

                        {pillars.map((pillar: any, index: number) => (
                            <SectionBlock key={index} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #C6A500' }}>
                                <h5 style={{ color: '#C6A500', marginBottom: 10 }}>Trụ cột {index + 1}: {pillar.title}</h5>
                                <InputGroup><label>Tiêu đề</label><input type="text" value={pillar.title || ''} onChange={(e) => updatePillar(index, 'title', e.target.value)}/></InputGroup>
                                <InputGroup><label>Mô tả</label><textarea value={pillar.description || ''} onChange={(e) => updatePillar(index, 'description', e.target.value)}/></InputGroup>
                                
                                <ImageUploadGroup 
                                    label="URL Hình ảnh Trụ cột"
                                    imageUrl={pillar.image || `/images/about/pillar-${index + 1}.jpg`}
                                    onUploadSuccess={(url) => handlePillarImageUpdate(index, url)}
                                    onTextChange={(url) => updatePillar(index, 'image', url)}
                                    uploadSubdir='about/pillars'
                                />
                                
                                <h6 style={{ marginTop: '15px' }}>Milestones (Sửa JSON thô)</h6>
                                <InputGroup>
                                    <textarea 
                                        // Đảm bảo dữ liệu là chuỗi JSON hợp lệ khi đọc
                                        value={JSON.stringify(pillar.milestones || [], null, 2)} 
                                        // Khi thay đổi, cập nhật mảng dưới dạng chuỗi
                                        onChange={(e) => updatePillar(index, 'milestones', e.target.value)}
                                        rows={5}
                                    />
                                    <p style={{ fontSize: '0.8rem', color: '#777' }}>*Nhập dưới dạng JSON Array: `["Mục 1", "Mục 2"]`</p>
                                </InputGroup>
                            </SectionBlock>
                        ))}
                    </SectionBlock>
                );

            case 'Timeline':
                return (
                    <SectionBlock>
                        <SectionTitle>4. Hành Trình Phát Triển</SectionTitle>
                        <InputGroup>
                            <label>Tiêu đề Timeline</label>
                            <input type="text" value={content.about_page?.timeline_title || ''} onChange={(e) => updateContent(['about_page', 'timeline_title'], e.target.value)} />
                        </InputGroup>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <AddButton onClick={() => {
                                // Thêm sự kiện mới
                                const newTimeline = [...timeline, { year: "Năm mới", event: "Sự kiện mới", icon: "new" }];
                                updateContent(['about_page', 'timeline'], JSON.stringify(newTimeline, null, 2));
                            }}>+ Thêm Sự Kiện</AddButton>
                        </div>

                        {timeline.map((event: any, index: number) => (
                            <SectionBlock key={index} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #bbb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h5 style={{ color: '#C6A500', marginBottom: 10 }}>Sự kiện {index + 1}</h5>
                                    <RemoveButton 
                                        onClick={() => removeTimelineEvent(index)}
                                    >
                                        Xóa Sự Kiện
                                    </RemoveButton>
                                </div>
                                <InputGroup><label>Năm</label><input type="text" value={event.year || ''} onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}/></InputGroup>
                                <InputGroup><label>Sự kiện</label><textarea value={event.event || ''} onChange={(e) => updateTimelineItem(index, 'event', e.target.value)}/></InputGroup>
                                <InputGroup><label>Icon Key (Ví dụ: star, diploma)</label><input type="text" value={event.icon || ''} onChange={(e) => updateTimelineItem(index, 'icon', e.target.value)}/></InputGroup>
                            </SectionBlock>
                        ))}
                    </SectionBlock>
                );

            case 'CTA': // CTA riêng cho trang About
                return (
                    <SectionBlock>
                        <SectionTitle>5. CTA Đóng Trang Về Chúng Tôi</SectionTitle>
                        <InputGroup>
                            <label>Tiêu đề CTA</label>
                            <input type="text" value={content.about_page?.cta_about_title || ''} onChange={(e) => updateContent(['about_page', 'cta_about_title'], e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <label>Nút CTA</label>
                            <input type="text" value={content.about_page?.cta_about_button || ''} onChange={(e) => updateContent(['about_page', 'cta_about_button'], e.target.value)} />
                        </InputGroup>
                    </SectionBlock>
                );

            default:
                return <p>Vui lòng chọn một mục con để chỉnh sửa nội dung trang "Về Chúng Tôi".</p>;
        }
    };

    return (
        <div style={{ paddingBottom: '30px' }}>
            {/* --- ADMIN CONTROLS --- */}
            <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#222' }}>{activeSection.replace(/([A-Z])/g, ' $1').trim()} ({lang.toUpperCase()})</h1>
                <p style={{ color: status.startsWith('LỖI') ? 'red' : 'green', fontWeight: 'bold' }}>{status}</p>
            </div>

            <div style={{ padding: '20px 0' }}>
                <ButtonGroup style={{ justifyContent: 'flex-start', gap: '20px' }}>
                    <SaveButton onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Đang lưu...' : 'LƯU NỘI DUNG MỤC NÀY'}
                    </SaveButton>
                    <RawToggle onClick={() => setIsRaw(!isRaw)}>
                        {isRaw ? '↩️ Quay lại UI' : '⚙️ Chỉnh sửa RAW JSON'}
                    </RawToggle>
                </ButtonGroup>
            </div>

            {/* RAW JSON EDITOR */}
            {isRaw && (
                <EditorArea
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                />
            )}
            
            {/* STRUCTURED UI EDITOR */}
            {!isRaw && (
                <>{renderAboutSection()}</>
            )}
        </div>
    );
};

export default AdminAboutEditor;