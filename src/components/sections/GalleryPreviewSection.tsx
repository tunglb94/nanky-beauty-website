import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n';
import { useRouter } from 'next/router';
import { useRevealAnimation } from '../../hooks/useScrollAnimation';
import Image from 'next/image'; // Import Image

const MAX_IMAGES = 9;

// --- Styled Components ---
const GalleryTeaserWrapper = styled.section`
    padding: 100px 80px;
    background-color: #fff;
    text-align: center;
    cursor: pointer;

    @media (max-width: 768px) {
        padding: 60px 25px;
    }
`;

const TeaserTitle = styled.h2` // Giữ là h2
    font-size: 3rem;
    color: #222;
    margin-bottom: 20px;
     @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const TeaserSubtitle = styled.p`
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 60px;
     @media (max-width: 768px) {
         font-size: 1.1rem;
    }
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 150px); // Giữ chiều cao row gốc
    gap: 15px;
    max-width: 900px;
    margin: 0 auto;

    @media (max-width: 1024px) {
        grid-template-rows: repeat(3, 200px); // Giữ chiều cao tablet gốc
        max-width: 100%;
    }
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
`;

const ImageItem = styled(motion.div)`
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    position: relative; // Cần thiết cho Next/Image fill
    height: 100%;

     // Target Next/Image bên trong
    .gallery-preview-image {
        transition: transform 0.5s ease;
    }

    &:hover .gallery-preview-image {
        transform: scale(1.08);
    }

    @media (max-width: 768px) {
         height: 250px; // Giữ chiều cao mobile gốc
    }
`;

// --- SỬA MÀU LINK CHO ĐỦ CONTRAST (Giữ nguyên) ---
const ViewMoreLink = styled.p`
    margin-top: 40px;
    color: #A08400; /* Màu vàng đậm hơn */
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    transition: text-decoration 0.2s ease;

    &:hover {
        text-decoration: underline;
    }
`;


// --- Interfaces ---
interface GalleryProject {
    mainImage: string;
    additionalImages?: string[];
}

interface GalleryPreviewSectionProps {
    galleryProjects: GalleryProject[];
}

const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({ galleryProjects }) => {
    const { t } = useI18n();
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const { ref, inView } = useRevealAnimation(0.1, true);

    useEffect(() => { // Logic lấy ảnh giữ nguyên
        const imageList: string[] = [];
        for (const project of galleryProjects) {
            if (project.mainImage) { imageList.push(project.mainImage); }
            if (project.additionalImages && Array.isArray(project.additionalImages)) {
                 for(const img of project.additionalImages) { if(img) imageList.push(img); }
            }
            if (imageList.length >= MAX_IMAGES) break;
        }
        setImages(imageList.slice(0, MAX_IMAGES));

        if (galleryProjects.length === 0 && imageList.length === 0) {
             setImages([
                t('gallery_teaser_image_0') || '',
                t('gallery_teaser_image_1') || '',
                t('gallery_teaser_image_2') || '',
                t('gallery_teaser_image_3') || ''
             ].filter(Boolean).slice(0, MAX_IMAGES));
        }

    }, [galleryProjects, t]);

    const imageVariants = { // Giữ nguyên variants
        hidden: { opacity: 0, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, delay: i * 0.1 }
        }),
    };

    return (
        <GalleryTeaserWrapper id="gallery-preview" onClick={() => router.push('/gallery')} ref={ref}>
            <TeaserTitle>{t('gallery_teaser_title') || 'Feedback Khách Hàng'}</TeaserTitle>
            <TeaserSubtitle>Xem {MAX_IMAGES} tác phẩm nối mi mới nhất của Nanky Beauty.</TeaserSubtitle>

            <ImageGrid>
                {images.map((src, index) => (
                    <ImageItem
                        key={index}
                        variants={imageVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        custom={index}
                    >
                        {src ? (
                           // --- SỬA CÚ PHÁP IMAGE ---
                           <Image
                                src={src}
                                alt={`Tác phẩm nối mi ${index + 1}`}
                                fill // Thay layout="fill"
                                style={{ objectFit: 'cover' }} // Thay objectFit bằng style
                                quality={70}
                                className="gallery-preview-image"
                                // === THÊM SIZES ===
                                sizes="(max-width: 768px) 100vw, 33vw" // Ước lượng: 1 cột mobile, 3 cột desktop
                           />
                           // --- KẾT THÚC SỬA ---
                         ) : (
                            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#555', padding: '10px'}}>{`Tác phẩm nối mi ${index + 1} (Ảnh bị thiếu)`}</div>
                         )}
                    </ImageItem>
                ))}
            </ImageGrid>
            <ViewMoreLink>
                Xem thêm {galleryProjects.length}+ tác phẩm tại Gallery →
            </ViewMoreLink>
        </GalleryTeaserWrapper>
    );
};

export default GalleryPreviewSection;