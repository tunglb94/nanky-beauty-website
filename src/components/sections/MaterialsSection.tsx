import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// *** ĐÃ SỬA: CHỈ IMPORT HOOK THỰC TẾ ***
import { useI18n } from '../../hooks/useI18n'; 
// BỎ CÁC DÒNG IMPORT DỮ LIỆU CỨNG
import { useRevealAnimation } from '../../hooks/useScrollAnimation';

// Cấu trúc dữ liệu brands được sử dụng cho cả 3 cột
const RAW_MATERIAL_STRUCTURE = [
    // Section 1: Lashes (5 brands)
    { key: 'lashes', count: 5 },
    // Section 2: Adhesives (4 brands)
    { key: 'adhesives', count: 4 },
    // Section 3: Tools & Accessories (4 items)
    { key: 'tools', count: 4 }
];


const MaterialsWrapper = styled.section`
  /* *** NỀN TRẮNG TINH MỚI *** */
  padding: 100px 80px;
  background-color: #fff; 
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 25px; /* ĐÃ TỐI ƯU: Giảm padding dọc */
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  color: #222; /* Dark Text */
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem; /* ĐÃ TỐI ƯU: Giảm cỡ chữ tiêu đề chính */
  }
`;

const SectionDescription = styled(motion.p)`
    font-size: 1.1rem;
    color: #666; /* Dark Text */
    max-width: 900px;
    margin: 0 auto 80px;

    @media (max-width: 768px) {
        margin-bottom: 40px;
        font-size: 1rem; /* Tối ưu cỡ chữ */
    }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  text-align: left;

  /* *** MOBILE OPTIMIZATION: 1 CỘT *** */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const MaterialCategoryCard = styled(motion.div)`
    background-color: #fff; 
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); 
    transition: transform 0.4s ease;
    border-top: 5px solid #C6A500; 
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }
    
    /* === TỐI ƯU MOBILE: Giảm padding thẻ con === */
    @media (max-width: 768px) {
        padding: 20px;
    }
`;

const CategoryHeader = styled.div`
    margin-bottom: 25px;
`;

const CategoryTitle = styled.h4`
    font-size: 1.8rem;
    color: #C6A500; 
    margin-bottom: 5px;
    font-weight: 700;
    
    /* === TỐI ƯU MOBILE: Giảm cỡ chữ tiêu đề danh mục === */
    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const CategorySubtitle = styled.p`
    font-size: 0.95rem;
    color: #999;
    font-style: italic;
    border-bottom: 1px dashed #eee;
    padding-bottom: 15px;
`;

const BrandList = styled.ul`
    list-style: none;
    padding: 0;
    li {
        display: flex;
        flex-direction: column;
        padding: 15px 0;
        border-bottom: 1px dashed #eee;
        
        &:last-child {
            border-bottom: none;
        }
    }
`;

const BrandLinkContainer = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.3s ease;
    
    &:hover {
        color: #FFD700;
    }
`;

const BrandLogo = styled.img`
    width: 30px;
    height: 30px;
    object-fit: contain;
    filter: grayscale(100%); 
    opacity: 0.8;
    transition: all 0.3s ease;

    ${BrandLinkContainer}:hover & {
        filter: grayscale(0%);
        opacity: 1;
    }
`;

const BrandName = styled.span`
    font-weight: 700;
    color: #333;
    font-size: 1.1rem;
`;

const BrandCountry = styled.span`
    font-weight: 400;
    color: #C6A500; 
    font-size: 1rem;
    margin-left: 5px;
`;

const BrandDetail = styled.span`
    color: #666;
    font-size: 0.95rem;
    /* Đã giảm margin-left để bù cho việc xóa Logo */
    margin-left: 0; 
`;

const BrandHomepage = styled.a`
    display: block;
    font-size: 0.8rem;
    color: #aaa;
    margin-top: 5px;
    /* Đã giảm margin-left để bù cho việc xóa Logo */
    margin-left: 0; 
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
        color: #FFD700;
    }
`;


const MaterialsSection: React.FC = () => {
    const { t } = useI18n(); 

    // Logic tính toán động dữ liệu thương hiệu dựa trên cấu trúc key
    const materialData = RAW_MATERIAL_STRUCTURE.map((section, index) => {
        // Tạo một mảng brands dựa trên số lượng đếm (count)
        const brands = Array.from({ length: section.count }, (_, i) => {
            const baseKey = `materials.sections.${index}.brands.${i}`;
            
            return {
                name: t(`${baseKey}.name`),
                country: t(`${baseKey}.country`),
                detail: t(`${baseKey}.detail`),
                logoUrl: t(`${baseKey}.logoUrl`),
                homepageUrl: t(`${baseKey}.homepageUrl`)
            };
        });

        const sectionKey = `materials.sections.${index}`;
        
        return {
            name: t(`${sectionKey}.name`),
            subtitle: t(`${sectionKey}.subtitle`),
            brands: brands
        };
    });


    const { ref, inView } = useRevealAnimation(0.2, true);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <MaterialsWrapper id="materials" ref={ref}>
            <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
            >
                {t('materials.title')}
            </SectionTitle>
            <SectionDescription
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
            >
                {t('materials.description')}
            </SectionDescription>

            <Grid>
                {materialData.map((category, index) => (
                    <MaterialCategoryCard
                        key={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                        transition={{ delay: index * 0.15 + 0.5 }}
                    >
                        <CategoryHeader>
                            <CategoryTitle>{category.name}</CategoryTitle>
                            <CategorySubtitle>{category.subtitle}</CategorySubtitle>
                        </CategoryHeader>

                        <BrandList>
                            {category.brands.map((brand: any, i: number) => (
                                <li key={i}>
                                    <BrandLinkContainer 
                                        href={brand.homepageUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {/* ĐÃ XÓA: Bỏ BrandLogo */}
                                        <BrandName>
                                            {brand.name}
                                            <BrandCountry>{brand.country}</BrandCountry>
                                        </BrandName>
                                    </BrandLinkContainer>
                                    
                                    <BrandDetail>{brand.detail}</BrandDetail>
                                    
                                    {brand.homepageUrl && brand.homepageUrl !== '#' && (
                                        <BrandHomepage 
                                            href={brand.homepageUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            🔗 {brand.homepageUrl.replace(/(https?:\/\/)/, '').replace(/\/$/, '')}
                                        </BrandHomepage>
                                    )}
                                </li>
                            ))}
                        </BrandList>
                    </MaterialCategoryCard>
                ))}
            </Grid>
        </MaterialsWrapper>
    );
};

export default MaterialsSection;