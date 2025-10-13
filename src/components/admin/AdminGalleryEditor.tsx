import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploadGroup from './ImageUploadGroup';

// --- Styled Components ---
const EditorContainer = styled.div` padding: 20px 0; `;
const SectionTitle = styled.h2` font-size: 1.8rem; color: #222; border-bottom: 2px solid #C6A500; padding-bottom: 10px; margin-bottom: 20px; `;
const Button = styled.button` background: #C6A500; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; border: none; transition: all 0.3s; &:hover { background: #FFD700; } &:disabled { background: #ccc; } `;
const AddButton = styled(Button)` background: #3498db; `;
const RemoveButton = styled(Button)` background: #e74c3c; padding: 5px 10px; font-size: 0.8rem; `;
const ImageGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; `;
const ProjectCard = styled(motion.div)` background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; flex-direction: column; `;
const InputGroup = styled.div` margin-bottom: 12px; label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 0.9rem; } input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; } `;
const StatusMessage = styled.p<{ $isError?: boolean }>` text-align: center; margin: 20px 0; font-weight: bold; color: ${({ $isError }) => $isError ? '#ef4444' : '#10b981'}; `;
const CategoryManagerWrapper = styled.div` background-color: #fffaf0; border: 1px dashed #C6A500; padding: 20px; margin-bottom: 30px; border-radius: 8px; `;
const CategoryList = styled.ul` list-style: none; padding: 0; margin-top: 15px; `;
const CategoryItem = styled.li` display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee; &:last-child { border-bottom: none; } `;
const SubImagesContainer = styled.div` border-top: 1px dashed #ccc; margin-top: 15px; padding-top: 15px; `;
const SubImageWrapper = styled.div` margin-bottom: 15px; border: 1px solid #e0e0e0; padding: 10px; border-radius: 5px; background: #fff; `;


// --- Interfaces ---
interface GalleryProject {
  id: string;
  mainImage: string;
  additionalImages: string[];
  alt: string;
  category: string;
  customerName: string;
  serviceDate: string;
  satisfaction: number;
}

// --- Category Manager Component ---
const CategoryManager: React.FC<{
    initialCategories: string[],
    onCategoriesChange: (cats: string[]) => void
}> = ({ initialCategories, onCategoriesChange }) => {
    const [cats, setCats] = useState(initialCategories);
    const [newCat, setNewCat] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => setCats(initialCategories), [initialCategories]);

    const handleAdd = () => {
        if (newCat && !cats.includes(newCat)) {
            const updatedCats = [...cats, newCat];
            setCats(updatedCats);
            onCategoriesChange(updatedCats);
            setNewCat('');
        }
    };
    const handleRemove = (catToRemove: string) => {
        const updatedCats = cats.filter(c => c !== catToRemove);
        setCats(updatedCats);
        onCategoriesChange(updatedCats);
    };
    const handleSaveCategories = async () => {
        setIsLoading(true);
        const response = await fetch('/api/gallery-categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categories: cats })
        });
        setIsLoading(false);
        setStatus(response.ok ? 'Lưu danh mục thành công!' : 'Lỗi khi lưu.');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <CategoryManagerWrapper>
            <h4>Quản lý Danh mục</h4>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Tên danh mục mới" />
                <AddButton onClick={handleAdd}>Thêm</AddButton>
                <Button onClick={handleSaveCategories} disabled={isLoading}>{isLoading ? 'Đang lưu...' : 'Lưu Danh Mục'}</Button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#777' }}>Lưu ý: Sau khi thêm/xóa, bạn cần nhấn "Lưu Danh Mục" để áp dụng cho toàn hệ thống.</p>
            {status && <p>{status}</p>}
            <CategoryList>
                {cats.map(cat => (
                    <CategoryItem key={cat}>
                        <span>{cat}</span>
                        <RemoveButton onClick={() => handleRemove(cat)}>Xóa</RemoveButton>
                    </CategoryItem>
                ))}
            </CategoryList>
        </CategoryManagerWrapper>
    );
};

// --- Component Chính ---
const AdminGalleryEditor: React.FC = () => {
    const [projects, setProjects] = useState<GalleryProject[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', isError: false });

    useEffect(() => {
        Promise.all([
            fetch('/api/gallery').then(res => res.json()),
            fetch('/api/gallery-categories').then(res => res.json())
        ]).then(([galleryData, categoryData]) => {
            setProjects(galleryData.map((p: any) => ({ ...p, additionalImages: p.additionalImages || [] }))); // Đảm bảo additionalImages luôn là mảng
            setCategories(categoryData);
        }).catch(() => {
            setStatus({ message: 'Lỗi: Không thể tải dữ liệu.', isError: true });
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);
    
    const handleUpdateProjectField = (id: string, field: keyof GalleryProject, value: any) => {
        setProjects(current => current.map(p => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleUpdateAdditionalImage = (projectId: string, imageIndex: number, newUrl: string) => {
        setProjects(current => current.map(p => {
            if (p.id === projectId) {
                const updatedImages = [...p.additionalImages];
                updatedImages[imageIndex] = newUrl;
                return { ...p, additionalImages: updatedImages };
            }
            return p;
        }));
    };

    const handleAddAdditionalImage = (projectId: string) => {
        setProjects(current => current.map(p => {
            if (p.id === projectId) {
                return { ...p, additionalImages: [...p.additionalImages, ''] }; // Thêm một slot ảnh phụ mới
            }
            return p;
        }));
    };

    const handleRemoveAdditionalImage = (projectId: string, imageIndex: number) => {
         setProjects(current => current.map(p => {
            if (p.id === projectId) {
                const updatedImages = p.additionalImages.filter((_, idx) => idx !== imageIndex);
                return { ...p, additionalImages: updatedImages };
            }
            return p;
        }));
    };

    const handleAddProject = () => {
        const newProject: GalleryProject = {
            id: Date.now().toString(),
            mainImage: '',
            additionalImages: [],
            alt: 'Tác phẩm nối mi mới tại Nanky Beauty Quận 2',
            category: categories[0] || 'Chưa phân loại',
            customerName: '',
            serviceDate: new Date().toISOString().split('T')[0],
            satisfaction: 5
        };
        setProjects(current => [newProject, ...current]);
    };

    const handleRemoveProject = (id: string) => {
        if(window.confirm('Bạn có chắc chắn muốn xóa tác phẩm này?')) {
            setProjects(current => current.filter(p => p.id !== id));
        }
    };
    
    const handleSaveAll = async () => {
        setIsLoading(true);
        setStatus({ message: '', isError: false });
        try {
            // Lọc ra các url rỗng trong additionalImages trước khi lưu
            const cleanProjects = projects.map(p => ({
                ...p,
                additionalImages: p.additionalImages.filter(url => url && url.trim() !== '')
            }));

            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ galleryData: cleanProjects }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setStatus({ message: data.message, isError: false });
        } catch (error: any) {
            setStatus({ message: `Lỗi khi lưu: ${error.message}`, isError: true });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus({ message: '', isError: false }), 5000);
        }
    };

    return (
        <EditorContainer>
            <SectionTitle>Quản lý Bộ sưu tập (Portfolio)</SectionTitle>
            
            <CategoryManager initialCategories={categories} onCategoriesChange={setCategories} />

            <div style={{ marginBottom: '20px' }}>
                <AddButton onClick={handleAddProject} disabled={isLoading}>+ Thêm tác phẩm mới</AddButton>
                <Button onClick={handleSaveAll} disabled={isLoading} style={{ marginLeft: '10px' }}>
                    {isLoading ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
                </Button>
            </div>
            
            {status.message && <StatusMessage $isError={status.isError}>{status.message}</StatusMessage>}
            {isLoading && <p>Đang tải dữ liệu...</p>}

            <ImageGrid>
              <AnimatePresence>
                {projects.map(project => (
                    <ProjectCard key={project.id} layout>
                        <ImageUploadGroup
                            label="Ảnh Đại Diện"
                            imageUrl={project.mainImage}
                            onUpdate={(newUrl) => handleUpdateProjectField(project.id, 'mainImage', newUrl)}
                            uploadSubdir="gallery"
                            uniqueId={`${project.id}-main`}
                            setStatus={setStatus} // FIX: Thêm prop setStatus
                            isLoading={isLoading} // FIX: Thêm prop isLoading
                        />
                        <InputGroup>
                            <label>Mô tả (thẻ alt)</label>
                            <input type="text" value={project.alt} onChange={e => handleUpdateProjectField(project.id, 'alt', e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <label>Tên khách hàng</label>
                            <input type="text" value={project.customerName} onChange={e => handleUpdateProjectField(project.id, 'customerName', e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <label>Ngày làm</label>
                            <input type="date" value={project.serviceDate} onChange={e => handleUpdateProjectField(project.id, 'serviceDate', e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <label>Mức độ hài lòng</label>
                            <select value={project.satisfaction} onChange={e => handleUpdateProjectField(project.id, 'satisfaction', parseInt(e.target.value, 10))}>
                                <option value={5}>5 ⭐ (Rất hài lòng)</option>
                                <option value={4}>4 ⭐ (Hài lòng)</option>
                                <option value={3}>3 ⭐ (Bình thường)</option>
                            </select>
                        </InputGroup>
                        <InputGroup>
                            <label>Danh mục</label>
                            <select value={project.category} onChange={e => handleUpdateProjectField(project.id, 'category', e.target.value)}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </InputGroup>
                        
                        <SubImagesContainer>
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px' }}>Các ảnh phụ</label>
                            {project.additionalImages.map((imgUrl, index) => (
                                <SubImageWrapper key={index}>
                                    <ImageUploadGroup
                                        label={`Ảnh phụ ${index + 1}`}
                                        imageUrl={imgUrl}
                                        onUpdate={(newUrl) => handleUpdateAdditionalImage(project.id, index, newUrl)}
                                        uploadSubdir="gallery"
                                        uniqueId={`${project.id}-sub-${index}`}
                                        setStatus={setStatus} // FIX: Thêm prop setStatus
                                        isLoading={isLoading} // FIX: Thêm prop isLoading
                                    />
                                    <RemoveButton onClick={() => handleRemoveAdditionalImage(project.id, index)} style={{marginTop: '5px'}}>Xóa ảnh phụ này</RemoveButton>
                                </SubImageWrapper>
                            ))}
                            <AddButton onClick={() => handleAddAdditionalImage(project.id)} style={{width: '100%', marginTop: '10px'}}>+ Thêm ảnh phụ</AddButton>
                        </SubImagesContainer>
                        
                        <RemoveButton onClick={() => handleRemoveProject(project.id)} style={{marginTop: '20px', backgroundColor: '#c0392b'}}>Xóa Toàn Bộ Tác Phẩm Này</RemoveButton>
                    </ProjectCard>
                ))}
              </AnimatePresence>
            </ImageGrid>
        </EditorContainer>
    );
};

export default AdminGalleryEditor;