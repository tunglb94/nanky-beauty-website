    import React, { useState } from 'react';
    import styled from 'styled-components';
    import { motion } from 'framer-motion';

    // ===============================================
    // UI COMPONENTS (Giữ nguyên)
    // ===============================================

    const EditorContainer = styled.div`
    padding: 0;
    max-width: 100%;
    margin: 0 auto;
    background: white;
    `;

    const SectionBlock = styled(motion.div)`
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        background-color: #f9f9f9;
    `;

    const SectionTitle = styled.h2`
        color: #222;
        border-bottom: 2px solid #C6A500;
        padding-bottom: 10px;
        margin-bottom: 20px;
        font-size: 1.8rem;
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

    const RemoveButton = styled.button`
        background: #e74c3c;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.8rem;
        margin-left: 10px;
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
    // HELPER COMPONENT (Image Upload)
    // ===============================================

    interface ImageUploadGroupProps {
        label: string;
        imageUrl: string;
        onUploadSuccess: (newUrl: string) => void;
        onTextChange: (newUrl: string) => void;
        uploadSubdir: string; 
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
                    setStatus(`Upload thành công! URL: ${data.url}`); 
                } else {
                    setUploadStatus(`LỖI UPLOAD: ${data.error || 'Server error'}`);
                    setStatus(`LỖI UPLOAD: ${data.error || 'Server error'}`); 
                }
            })
            .catch(() => {
                setUploadStatus('LỖI MẠNG: Không thể kết nối API upload.');
                setStatus('LỖI MẠNG: Không thể kết nối API upload.'); 
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


    // ===============================================
    // MAIN ADMIN EDITOR LOGIC
    // ===============================================

    // *** EXPORT INTERFACE CHUNG NÀY ***
    export interface AdminEditorProps {
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
    // **********************************

    const AdminContentEditor: React.FC<AdminEditorProps> = ({ lang, activeSection, content, updateContent, handleSave, isLoading, status, setStatus, isRaw, setIsRaw, rawContent, setRawContent }) => {
    
    // Tổng số lượng item mặc định
    const DEFAULT_NUM_SERVICES = 4;
    const DEFAULT_NUM_TESTIMONIALS = 6;
    const NUM_GALLERY_TEASER_IMAGES = 4;


    // ===============================================
    // LOGIC THÊM/XÓA DỊCH VỤ (Giữ nguyên)
    // ===============================================

    const getCurrentServiceKeys = () => {
        let keys: number[] = [];
        let i = 0;
        while(content && (content[`service_${i}_title`] || content[`service_${i}_desc`] || content[`service_${i}_price`])) {
            keys.push(i);
            i++;
        }
        if (keys.length === 0) {
            return Array.from({ length: DEFAULT_NUM_SERVICES }, (_, i) => i);
        }
        return keys;
    }
    
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
        
        const newContent = JSON.parse(rawContent); 
        
        newContent[newTitleKey] = `Dịch vụ mới ${newIndex}`;
        newContent[newDescKey] = `Mô tả cho dịch vụ mới ${newIndex}`;
        newContent[newImageKey] = `/images/services/service-new-${newIndex}.jpg`;
        newContent[newPriceKey] = `Liên hệ`;

        setRawContent(JSON.stringify(newContent, null, 2));
        setStatus(`Đã thêm dịch vụ mới: service_${newIndex} (Chỉ trong Editor). Vui lòng LƯU để áp dụng.`);
    };


    // ===============================================
    // HANDLERS CHO UPLOAD ẢNH (Giữ nguyên)
    // ===============================================
    
    const handleHeroBackgroundUpdate = (newUrl: string) => {
        updateContent(['hero', 'backgroundUrl'], newUrl);
    };
    
    const handleWhyUsImageUpdate = (cardIndex: number, newUrl: string) => {
        updateContent(['why_us', 'cards', cardIndex, 'imageUrl'], newUrl);
    };
    
    const handleServiceImageUpdate = (serviceIndex: number, newUrl: string) => {
        updateContent([`service_${serviceIndex}_imageUrl`], newUrl);
    };
    
    const handleTestimonialImageUpdate = (imageKey: string, newUrl: string) => {
        updateContent([imageKey], newUrl);
    };
    
    const handleGalleryTeaserImageUpdate = (imageIndex: number, newUrl: string) => {
        updateContent([`gallery_teaser_image_${imageIndex}`], newUrl);
    };
    
    const handleMaterialLogoUpdate = (sectionIndex: number, brandIndex: number, newUrl: string) => {
        updateContent(['materials', 'sections', sectionIndex, 'brands', brandIndex, 'logoUrl'], newUrl);
    };
    
    // ===============================================
    // CHUẨN BỊ DỮ LIỆU RENDER
    // ===============================================
    
    const serviceKeys = getCurrentServiceKeys(); 

    const servicesData = serviceKeys.map((i) => ({
        titleKey: `service_${i}_title`,
        descKey: `service_${i}_desc`,
        imageKey: `service_${i}_imageUrl`,
        priceKey: `service_${i}_price`,
        defaultImageUrl: `/images/services/service-${i + 1}.jpg`, 
        index: i
    }));
    
    const testimonialsData = Array.from({ length: DEFAULT_NUM_TESTIMONIALS }, (_, i) => ({
        nameKey: `review_${i + 1}_name`,
        quoteKey: `review_${i + 1}_quote`,
        imageKey: `review_${i + 1}_imageUrl`,
        defaultImageUrl: `/images/reviews/review-${i + 1}.jpg` 
    }));
    
    const galleryTeaserData = Array.from({ length: NUM_GALLERY_TEASER_IMAGES }, (_, i) => ({
        imageKey: `gallery_teaser_image_${i}`,
        defaultImageUrl: ['/images/gallery/mi-volume.jpg', '/images/gallery/mi-classic.jpg', '/images/gallery/mi-hybrid.jpg', '/images/gallery/mi-style.jpg'][i]
    }));
    
    const materialsSections = content?.materials?.sections || [];


    // ===============================================
    // RENDER THEO TAB
    // ===============================================

    const renderActiveSection = () => {
        // FIX: Sử dụng optional chaining (?.) để truy cập an toàn
        const heroContent = content?.hero || {}; 
        const whyUsContent = content?.why_us || {};

        switch (activeSection) {
        case 'Hero':
            return (
            <>
                <SectionTitle>1. Hero Banner (Đầu Trang)</SectionTitle>
                <InputGroup>
                <label>Tiêu đề Chính (Title)</label>
                <input type="text" value={heroContent.title || ''} onChange={(e) => updateContent(['hero', 'title'], e.target.value)} />
                </InputGroup>
                <InputGroup>
                <label>Tiêu đề Phụ (Subtitle)</label>
                <textarea value={heroContent.subtitle || ''} onChange={(e) => updateContent(['hero', 'subtitle'], e.target.value)} />
                </InputGroup>
                
                <ImageUploadGroup 
                    label="URL Ảnh Nền Hero (Background Image)"
                    imageUrl={heroContent.backgroundUrl || '/images/hero/hero-background.jpg'}
                    onUploadSuccess={handleHeroBackgroundUpdate}
                    onTextChange={handleHeroBackgroundUpdate}
                    uploadSubdir='hero'
                    setStatus={setStatus}
                    isLoading={isLoading}
                />
                <p style={{ color: '#C6A500', fontSize: '0.9rem', marginTop: '10px' }}>Ảnh nền Hero cần kích thước lớn (&gt;= 1920px).</p>
            </>
            );

        case 'WhyUs':
            return (
            <>
                <SectionTitle>2. Vì Sao Chọn Nanky (3 Trụ Cột)</SectionTitle>
                <InputGroup><label>Tiêu đề Section (Title)</label><input type="text" value={whyUsContent.title || ''} onChange={(e) => updateContent(['why_us', 'title'], e.target.value)}/></InputGroup>
                <InputGroup><label>Mô tả Section (Subtitle)</label><textarea value={whyUsContent.subtitle || ''} onChange={(e) => updateContent(['why_us', 'subtitle'], e.target.value)}/></InputGroup>
                
                {(whyUsContent.cards || []).map((card: any, index: number) => (
                    <SectionBlock key={index} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #C6A500' }}>
                        <h5 style={{ color: '#C6A500', marginBottom: 10 }}>Card {index + 1}: {card.title}</h5>
                        <InputGroup><label>Tiêu đề Card</label><input type="text" value={card.title || ''} onChange={(e) => updateContent(['why_us', 'cards', index, 'title'], e.target.value)}/></InputGroup>
                        <InputGroup><label>Nội dung</label><textarea value={card.description || ''} onChange={(e) => updateContent(['why_us', 'cards', index, 'description'], e.target.value)}/></InputGroup>
                        
                        <ImageUploadGroup 
                            label="URL Hình ảnh Card"
                            imageUrl={card.imageUrl || `/images/whyus/card-${index + 1}.jpg`}
                            onUploadSuccess={(url) => handleWhyUsImageUpdate(index, url)}
                            onTextChange={(url) => updateContent(['why_us', 'cards', index, 'imageUrl'], url)}
                            uploadSubdir='whyus'
                            setStatus={setStatus}
                            isLoading={isLoading}
                        />
                    </SectionBlock>
                ))}
            </>
            );

        case 'Services':
            return (
            <>
                <SectionTitle>3. Dịch Vụ Nối Mi Cao Cấp</SectionTitle>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <AddButton onClick={handleAddService}>+ Thêm Dịch Vụ Mới</AddButton>
                </div>
                
                {servicesData.map((service) => (
                    <SectionBlock key={service.index} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #bbb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 style={{ color: '#C6A500', marginBottom: 10 }}>Dịch vụ {service.index + 1} ({content[service.priceKey] || 'Liên hệ'})</h5>
                            <RemoveButton 
                                onClick={() => {
                                    updateContent([service.titleKey], null);
                                    updateContent([service.descKey], null);
                                    updateContent([service.imageKey], null);
                                    updateContent([service.priceKey], null); 
                                }}
                            >
                                Xóa Dịch Vụ
                            </RemoveButton>
                        </div>
                        
                        <InputGroup><label>Tiêu đề Dịch vụ</label><input type="text" value={content[service.titleKey] || ''} onChange={(e) => updateContent([service.titleKey], e.target.value)}/></InputGroup>
                        <InputGroup><label>Mô tả Dịch vụ</label><textarea value={content[service.descKey] || ''} onChange={(e) => updateContent([service.descKey], e.target.value)}/></InputGroup>
                        
                        <InputGroup>
                            <label>Giá (Ví dụ: 600.000 VNĐ hoặc Liên hệ)</label>
                            <input type="text" value={content[service.priceKey] || ''} onChange={(e) => updateContent([service.priceKey], e.target.value)} />
                        </InputGroup>
                        
                        <ImageUploadGroup 
                            label="URL Ảnh Dịch Vụ"
                            imageUrl={content[service.imageKey] || service.defaultImageUrl}
                            onUploadSuccess={(url) => handleServiceImageUpdate(service.index, url)}
                            onTextChange={(url) => updateContent([service.imageKey], url)}
                            uploadSubdir='services'
                            setStatus={setStatus}
                            isLoading={isLoading}
                        />
                    </SectionBlock>
                ))}
            </>
            );
        
        case 'GalleryTeaser':
            return (
                <>
                    <SectionTitle>4. Ảnh Xem Trước Gallery (4 Ảnh)</SectionTitle>
                    {galleryTeaserData.map((gallery, index) => (
                        <SectionBlock key={index} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #bbb' }}>
                            <h5 style={{ color: '#C6A500', marginBottom: 10 }}>Ảnh Gallery {index + 1}</h5>
                            <ImageUploadGroup 
                                label="URL Ảnh Teaser"
                                imageUrl={content[gallery.imageKey] || gallery.defaultImageUrl}
                                onUploadSuccess={(url) => handleGalleryTeaserImageUpdate(index, url)}
                                onTextChange={(url) => updateContent([gallery.imageKey], url)}
                                uploadSubdir='gallery'
                                setStatus={setStatus}
                                isLoading={isLoading}
                            />
                        </SectionBlock>
                    ))}
                </>
            );

        case 'Testimonials':
            return (
            <>
                <SectionTitle>5. Cảm Nhận Khách Hàng</SectionTitle>
                <InputGroup><label>Tiêu đề Section (testimonials_title)</label><input type="text" value={content.testimonials_title || ''} onChange={(e) => updateContent(['testimonials_title'], e.target.value)}/></InputGroup>

                {testimonialsData.map((review, index) => (
                    <SectionBlock key={index} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #bbb' }}>
                        <h5 style={{ color: '#C6A500', marginBottom: 10 }}>Review {index + 1} (Tên: {content[review.nameKey] || 'Chưa đặt'})</h5>
                        
                        <ImageUploadGroup 
                            label="Ảnh Khách Hàng/Review"
                            imageUrl={content[review.imageKey] || review.defaultImageUrl}
                            onUploadSuccess={(url) => handleTestimonialImageUpdate(review.imageKey, url)} 
                            onTextChange={(url) => handleTestimonialImageUpdate(review.imageKey, url)}
                            uploadSubdir='reviews'
                            setStatus={setStatus}
                            isLoading={isLoading}
                        />
                        <InputGroup><label>Tên Khách Hàng</label><input type="text" value={content[review.nameKey] || ''} onChange={(e) => updateContent([review.nameKey], e.target.value)}/></InputGroup>
                        <InputGroup><label>Nội dung Review</label><textarea value={content[review.quoteKey] || ''} onChange={(e) => updateContent([review.quoteKey], e.target.value)}/></InputGroup>
                    </SectionBlock>
                ))}
            </>
            );

        case 'Materials':
            return (
                <>
                    <SectionTitle>6. Logo Thương Hiệu Nguyên Liệu</SectionTitle>
                    <InputGroup><label>Tiêu đề Section (Title)</label><input type="text" value={content.materials?.title || ''} onChange={(e) => updateContent(['materials', 'title'], e.target.value)}/></InputGroup>
                    <InputGroup><label>Mô tả Section (Description)</label><textarea value={content.materials?.description || ''} onChange={(e) => updateContent(['materials', 'description'], e.target.value)}/></InputGroup>
                    
                    {materialsSections.map((section: any, sectionIndex: number) => (
                        <SectionBlock key={sectionIndex} style={{ padding: 15, backgroundColor: '#fff', border: '1px dashed #C6A500' }}>
                            <h5 style={{ color: '#C6A500', marginBottom: 10 }}>{sectionIndex + 1}. {section.name}</h5>
                            <InputGroup><label>Tiêu đề (Subtitle)</label><input type="text" value={section.subtitle || ''} onChange={(e) => updateContent(['materials', 'sections', sectionIndex, 'subtitle'], e.target.value)}/></InputGroup>
                            
                            {(section.brands || []).map((brand: any, brandIndex: number) => (
                                <div key={brandIndex} style={{ borderBottom: '1px dotted #ccc', padding: '10px 0', marginBottom: '10px' }}>
                                    <h6 style={{ color: '#333', marginBottom: 5 }}>Tên Thương hiệu: {brand.name}</h6>
                                    <InputGroup style={{ marginBottom: 5 }}><label>Tên</label><input type="text" value={brand.name || ''} onChange={(e) => updateContent(['materials', 'sections', sectionIndex, 'brands', brandIndex, 'name'], e.target.value)}/></InputGroup>
                                    <InputGroup style={{ marginBottom: 5 }}><label>Mô tả (Detail)</label><input type="text" value={brand.detail || ''} onChange={(e) => updateContent(['materials', 'sections', sectionIndex, 'brands', brandIndex, 'detail'], e.target.value)}/></InputGroup>
                                    
                                    <ImageUploadGroup 
                                        label="URL Logo"
                                        imageUrl={brand.logoUrl || ''}
                                        onUploadSuccess={(url) => handleMaterialLogoUpdate(sectionIndex, brandIndex, url)}
                                        onTextChange={(url) => updateContent(['materials', 'sections', sectionIndex, 'brands', brandIndex, 'logoUrl'], url)}
                                        uploadSubdir='logos'
                                        setStatus={setStatus}
                                        isLoading={isLoading}
                                    />
                                </div>
                            ))}
                        </SectionBlock>
                    ))}
                </>
            );

        case 'CTA':
            return (
            <>
                <SectionTitle>7. CTA Tối Thượng (Chân Trang)</SectionTitle>
                <InputGroup><label>Tiêu đề Lớn (Title)</label><input type="text" value={content.cta_final?.title || ''} onChange={(e) => updateContent(['cta_final', 'title'], e.target.value)}/></InputGroup>
                <InputGroup><label>Ưu đãi/Mô tả (Subtitle)</label><textarea value={content.cta_final?.subtitle || ''} onChange={(e) => updateContent(['cta_final', 'subtitle'], e.target.value)}/></InputGroup>
                <InputGroup><label>Nút CTA (Button Text)</label><input type="text" value={content.cta_final?.button || ''} onChange={(e) => updateContent(['cta_final', 'button'], e.target.value)}/></InputGroup>
            </>
            );

        default:
            return <p>Vui lòng chọn một mục trong menu bên trái.</p>;
        }
    };


    return (
        <EditorContainer>
            <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#222' }}>{activeSection.replace(/([A-Z])/g, ' $1').trim()} ({lang.toUpperCase()})</h1>
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
                <div style={{ paddingBottom: '30px' }}>
                    {renderActiveSection()}
                </div>
            )}
        </EditorContainer>
    );
    };

    export default AdminContentEditor;