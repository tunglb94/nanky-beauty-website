import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { useI18n } from '../hooks/useI18n'; // SỬA ĐƯỜNG DẪN TẠI ĐÂY

const PageWrapper = styled.div`
    padding-top: 80px;
`;

const PageTitle = styled.h1`
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    color: #C6A500;
    text-align: center;
    padding: 60px 0 20px;
    background-color: #F9F9F9;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const FullGalleryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    padding: 40px 80px 100px;

    @media (max-width: 768px) {
        padding: 40px 25px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
`;

const GalleryItem = styled(motion.div)`
    height: 400px;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    &:hover img {
        transform: scale(1.05);
    }
`;

const GalleryPage: React.FC = () => {
    const { t } = useI18n();

    // Dữ liệu giả 9 ảnh
    const galleryImages = Array.from({ length: 9 }, (_, i) => ({
        src: `/images/gallery/full-img-${i + 1}.jpg`,
        alt: `Tác phẩm nối mi ${i + 1} tại Nanky Beauty Quận 2`
    }));

    // Lấy dữ liệu SEO từ file locales (cần được thêm vào sau này)
    const pageTitleText = t('header.gallery') || "Bộ Sưu Tập";

    return (
        <>
            <Head>
                {/* Bạn có thể thêm các thẻ meta SEO cho trang gallery ở đây */}
                <title>{pageTitleText} | Nanky Beauty - Nối Mi Quận 2</title>
                <meta name="description" content={`Khám phá bộ sưu tập các tác phẩm nối mi classic, volume, hybrid đẹp nhất được thực hiện tại Nanky Beauty, Thảo Điền, Quận 2, TP.HCM.`} />
            </Head>

            <Header />
            <PageWrapper>
                <PageTitle>{pageTitleText}</PageTitle>
                <FullGalleryGrid>
                    {galleryImages.map((image, index) => (
                        <GalleryItem
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img src={image.src} alt={image.alt} />
                        </GalleryItem>
                    ))}
                </FullGalleryGrid>
            </PageWrapper>
            <Footer />
        </>
    );
};

export default GalleryPage;