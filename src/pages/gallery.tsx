import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';
import { useRouter } from 'next/router'; // Đảm bảo hook này được dùng
import type { GetStaticProps } from 'next';

// THÊM CÁC MODULE NODE.JS DÙNG CHO getStaticProps (CHỈ CHẠY KHI BUILD CỤC BỘ)
import fs from 'fs';
import path from 'path';

// Các ngôn ngữ hỗ trợ (Cần đồng bộ với cấu hình i18n và sitemap)
const SUPPORTED_LANGS = ['vi', 'en', 'ru', 'kr', 'zh']; 
const URL = 'https://nankybeauty.com';

// Hàm tiện ích để render hreflang tags (Tái sử dụng)
const renderHreflangTags = (currentPath: string, supportedLangs: string[]) => {
    const basePagePath = currentPath.replace(new RegExp(`^/(${supportedLangs.filter(l => l !== 'vi').join('|')})/`), '/');
    const basePage = basePagePath === '/' ? '' : basePagePath.substring(1).split('/')[0];

    return supportedLangs.map((lang) => {
        const href = `${URL}/${lang === 'vi' ? basePage : `${lang}/${basePage}`}`.replace(/\/\/$/, '/');
        const hreflangAttr = lang === 'vi' ? 'x-default' : lang; 

        return (
            <link 
                key={lang} 
                rel="alternate" 
                hrefLang={hreflangAttr} 
                href={href} 
            />
        );
    });
};


// Styled components
const PageWrapper = styled.div`
    padding-top: 80px;
`;

const PageTitle = styled.h1`
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    color: #C6A500;
    text-align: center;
    padding: 60px 20px 20px;
    background-color: #F9F9F9;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const PageSubtitle = styled.p`
    font-size: 1.2rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto 40px;
    text-align: center;
`;

const FilterContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 50px;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
        gap: 10px;
        margin-bottom: 30px;
        padding: 0 25px;
    }
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
    background-color: ${({ $isActive }) => ($isActive ? '#C6A500' : '#f0f0f0')};
    color: ${({ $isActive }) => ($isActive ? '#fff' : '#333')};
    border: 1px solid ${({ $isActive }) => ($isActive ? '#C6A500' : '#ccc')};
    padding: 10px 25px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #C6A500;
        color: #fff;
    }
    
    @media (max-width: 768px) {
        padding: 8px 15px;
        font-size: 0.9rem;
    }
`;

const FullGalleryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    padding: 40px 80px 100px;

    @media (max-width: 768px) {
        padding: 40px 25px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
`;

const ItemOverlay = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 25px 20px;
    color: white;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 60%, transparent 100%);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
    transform: translateY(30%);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .info-line {
        margin: 0 0 8px;
        font-size: 1rem;
        color: #FFD700;
        font-weight: 500;
    }

    h4 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: #FFFFFF;
        line-height: 1.2;
    }
`;

const GalleryItem = styled(motion.div)`
    position: relative;
    height: 450px;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    cursor: pointer;
    background-color: #fff;
    
    .carousel-wrapper {
        width: 100%;
        height: 100%;
        transition: transform 0.4s ease;
    }
    
    .carousel .slide img {
        height: 450px;
        object-fit: cover;
    }
    
    &:hover {
        .carousel-wrapper {
            transform: scale(1.05);
        }
        ${ItemOverlay} {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        height: 350px;
        .carousel .slide img {
            height: 350px;
        }
    }
`;

// Interfaces (Đã định nghĩa trong file gốc gallery.tsx)
interface GalleryProject {
  id: string;
  mainImage: string;
  additionalImages: string[];
  alt: string;
  category: string; // Tên category bằng ngôn ngữ hiện tại
  customerName: string;
  serviceDate: string;
  satisfaction: number;
}

interface GalleryPageProps {
    galleryProjects: GalleryProject[];
    categories: string[]; // Danh sách các category key (ví dụ: "Classic", "Volume")
}

const GalleryPage: React.FC<GalleryPageProps> = ({ galleryProjects = [], categories = [] }) => {
    // FIX LỖI: Chỉ destructuring t từ useI18n() và gọi useRouter() riêng
    const { t } = useI18n();
    const router = useRouter(); 
    const [activeFilter, setActiveFilter] = useState('all');

    // SỬ DỤNG ĐÚNG KEYS TỪ gallery_page
    const seoDataRaw = t('gallery_page.seo');
    const seoData = typeof seoDataRaw === 'object' ? seoDataRaw : { title: '', description: '', keywords: '' };

    const globalSeoRaw = t('global_seo');
    const globalSeo = typeof globalSeoRaw === 'object' ? globalSeoRaw : { site_name: 'Nanky Beauty', title_separator: '|', default_og_image: '/images/social/default-sharing-image.jpg' };

    const pageTitle = `${seoData.title} ${globalSeo.title_separator} ${globalSeo.site_name}`;
    const pageHeaderText = t('gallery_page.title');
    const pageSubtitleText = t('gallery_page.subtitle');
    const filterAllText = t('gallery_page.filter_all');
    const ogImage = globalSeo.default_og_image;


    const filteredProjects = galleryProjects.filter(project => {
        if (activeFilter === 'all') return true;
        // Lọc dựa trên trường 'category' trong gallery.json
        return project.category === activeFilter;
    });
    
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                
                {/* OPEN GRAPH TAGS (Chia sẻ mạng xã hội) */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${URL}${router.asPath}`} />
                <meta property="og:site_name" content={globalSeo.site_name} />
                <meta property="og:image" content={`${URL}${ogImage}`} />
                {/* TWITTER CARD TAGS */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={seoData.description} />
                <meta name="twitter:image" content={`${URL}${ogImage}`} />
                
                 {/* === HREFLANG TAGS === */}
                {renderHreflangTags(router.asPath, SUPPORTED_LANGS)}
                {/* ====================== */}
            </Head>

            <Header />
            <PageWrapper>
                <PageTitle>{pageHeaderText}</PageTitle>
                <PageSubtitle>{pageSubtitleText}</PageSubtitle>

                <FilterContainer>
                    {/* Nút All */}
                    <FilterButton 
                        $isActive={activeFilter === 'all'} 
                        onClick={() => setActiveFilter('all')}
                    >
                        {filterAllText}
                    </FilterButton>
                    
                    {/* Các nút Category */}
                    {categories.map((categoryName) => (
                        <FilterButton
                            key={categoryName}
                            $isActive={activeFilter === categoryName}
                            onClick={() => setActiveFilter(categoryName)}
                        >
                            {categoryName}
                        </FilterButton>
                    ))}
                </FilterContainer>

                <FullGalleryGrid>
                    <AnimatePresence>
                        {(filteredProjects || []).map((project, index) => {
                            // Dữ liệu ngày tháng không có trong gallery.json gốc, nên không cần format.
                            const satisfaction = project.satisfaction || 5;

                            return (
                                <GalleryItem
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <div className="carousel-wrapper">
                                        {/* Hiển thị ảnh chính */}
                                        <img src={project.mainImage} alt={project.alt} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    </div>

                                    <ItemOverlay>
                                        <p className="info-line">
                                             {project.category} - {'⭐'.repeat(satisfaction)}
                                        </p>
                                        <h4>{project.customerName || t('gallery_page.default_customer_name') || project.category}</h4>
                                    </ItemOverlay>
                                </GalleryItem>
                            );
                        })}
                    </AnimatePresence>
                </FullGalleryGrid>
            </PageWrapper>
            <Footer />

        </>
    );
};

// Đã sửa lại GetStaticProps để chỉ đọc gallery.json và gallery-categories.json
export const getStaticProps: GetStaticProps<GalleryPageProps> = async (context) => {
    
    const galleryFilePath = path.join(process.cwd(), 'src', 'locales', 'gallery.json');
    const categoriesFilePath = path.join(process.cwd(), 'src', 'locales', 'gallery-categories.json');

    let galleryProjects: GalleryProject[] = [];
    let categories: string[] = [];
    
    try {
        const fileContent = fs.readFileSync(galleryFilePath, 'utf-8');
        // gallery.json chứa: id, mainImage, additionalImages, alt, category, customerName, serviceDate, satisfaction
        galleryProjects = JSON.parse(fileContent);

        const categoriesContent = fs.readFileSync(categoriesFilePath, 'utf-8');
        // gallery-categories.json chứa một mảng string: ["Classic", "Volume", ...]
        categories = JSON.parse(categoriesContent);

        return { 
            props: { 
                galleryProjects,
                categories
            },
        };
    } catch (error) {
        console.error("Lỗi khi đọc gallery data:", error);
        return { 
            props: { 
                galleryProjects: [],
                categories: []
            } 
        };
    }
};

export default GalleryPage;