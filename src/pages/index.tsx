import React from 'react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import WhyUsSection from '../components/sections/WhyUsSection';
import ServicesGrid from '../components/sections/ServicesGrid';
import MaterialsSection from '../components/sections/MaterialsSection';
import CallToAction from '../components/sections/CallToAction';
import GalleryPreviewSection from '../components/sections/GalleryPreviewSection';
import styled from 'styled-components';
import { useI18n } from '../hooks/useI18n';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useRevealAnimation } from '../hooks/useScrollAnimation';

// Thêm Node modules cần thiết để đọc file JSON
import fs from 'fs';
import path from 'path';

// Các ngôn ngữ hỗ trợ (Cần đồng bộ với cấu hình i18n và sitemap)
const SUPPORTED_LANGS = ['vi', 'en', 'ru', 'kr', 'zh'];
const URL = 'https://nankybeauty.com';

// Define the shape of a gallery item
interface GalleryProject {
  mainImage: string;
  additionalImages?: string[];
}

// Define props cho Home component
interface HomeProps {
    galleryProjects: GalleryProject[];
}

// Hàm tiện ích để render hreflang tags (Tái sử dụng)
const renderHreflangTags = (currentPath: string, supportedLangs: string[]) => {
    // Logic: Lấy đường dẫn cơ bản (ví dụ: /en -> '', /en/about -> about)
    const basePagePath = currentPath.replace(new RegExp(`^/(${supportedLangs.filter(l => l !== 'vi').join('|')})/`), '/');
    const basePage = basePagePath === '/' ? '' : basePagePath.substring(1).split('/')[0];

    return supportedLangs.map((lang) => {
        // Trang chủ Tiếng Việt là /, Tiếng Anh là /en. Các trang con: /about hoặc /en/about
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

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Cập nhật Home component để nhận props
const Home: React.FC<HomeProps> = ({ galleryProjects }) => {
  const { t, lang } = useI18n();
  const router = useRouter();

  const seoDataRaw = t('hero.seo');
  const seoData = typeof seoDataRaw === 'object' ? seoDataRaw : { title: '', description: '', keywords: '' };

  const globalSeoRaw = t('global_seo');
  const globalSeo = typeof globalSeoRaw === 'object' ? globalSeoRaw : { site_name: 'Nanky Beauty', title_separator: '|', default_og_image: '/images/social/default-sharing-image.jpg' };
  
  const pageTitle = `${globalSeo.site_name} ${globalSeo.title_separator} ${seoData.title}`;
  const ogImage = globalSeo.default_og_image;

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
        <meta property="og:url" content={URL} />
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

      <MainContent>
        <HeroSection />
        <WhyUsSection />
        <ServicesGrid />
        {/* Truyền gallery data trực tiếp vào component Preview */}
        <GalleryPreviewSection galleryProjects={galleryProjects} />
        <MaterialsSection />
        <CallToAction />
      </MainContent>

      <Footer />
    </>
  );
};

// Đọc dữ liệu Gallery tại thời điểm build
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const galleryFilePath = path.join(process.cwd(), 'src', 'locales', 'gallery.json');

    try {
        const fileContent = fs.readFileSync(galleryFilePath, 'utf-8');
        const galleryProjects: GalleryProject[] = JSON.parse(fileContent);

        return {
            props: {
                galleryProjects
            }
        };
    } catch (error) {
        console.error("Error reading gallery.json in Home page:", error);
        return {
            props: {
                galleryProjects: []
            }
        };
    }
};

export default Home;