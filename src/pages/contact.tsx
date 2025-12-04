import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useI18n } from '../hooks/useI18n';
import { useRouter } from 'next/router';

// Các ngôn ngữ hỗ trợ
const SUPPORTED_LANGS = ['vi', 'en', 'ru', 'kr', 'zh']; 
const URL = 'https://nankybeauty.com';

// Hàm tiện ích để render hreflang tags
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

// Styled Components
const ContactPageWrapper = styled.div`
    padding-top: 80px;
    padding-bottom: 80px;
    display: flex;
    justify-content: center;
    gap: 50px;
    min-height: 80vh;

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 40px 25px;
        gap: 30px;
    }
`;

const PageHeader = styled.h1`
    font-family: 'Inter', sans-serif; 
    font-size: 3.5rem;
    color: #333;
    padding: 120px 0 40px;
    background-color: #F9F9F9;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 2.5rem;
        padding: 80px 15px 30px;
    }
`;

const ContactInfoContainer = styled.div`
    flex-basis: 40%;
    padding: 30px;
    border: 1px solid #eee;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @media (max-width: 768px) {
        flex-basis: 100%;
        padding: 20px;
    }
`;

const MapContainer = styled.div`
    flex-basis: 40%;
    height: 500px;
    overflow: hidden;
    border: 1px solid #C6A500;

    @media (max-width: 768px) {
        flex-basis: 100%;
        height: 300px;
    }
`;

const CtaTitle = styled.h3`
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    color: #C6A500;
    margin-bottom: 30px;
`;

const CtaButton = styled(Button)`
    width: 100%;
    margin-bottom: 15px;
    padding: 15px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const SocialIconsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
    width: 80%;
    max-width: 350px;
`;

const SocialLinkButton = styled(motion.a)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    text-decoration: none;
    
    &:hover {
        transform: translateY(-3px);
    }
    
    div {
        font-size: 1.2rem;
        font-weight: 700;
        color: #fff;
    }
`;

const ContactPage: React.FC = () => {
    const { t } = useI18n();
    const router = useRouter(); 

    const seoDataRaw = t('contact_page.seo');
    const seoData = typeof seoDataRaw === 'object' ? seoDataRaw : { title: '', description: '', keywords: '' };

    const globalSeoRaw = t('global_seo');
    const globalSeo = typeof globalSeoRaw === 'object' ? globalSeoRaw : { site_name: 'Nanky Beauty', title_separator: '|', default_og_image: '/images/social/default-sharing-image.jpg' };

    const pageTitle = `${seoData.title} ${globalSeo.title_separator} ${globalSeo.site_name}`;
    const ogImage = globalSeo.default_og_image;
    
    const pageHeaderText = t('contact_page.title') || 'Liên Hệ & Đặt Lịch';
    const ctaHeader = t('contact_page.cta_header') || 'Liên Hệ Nhanh Qua';
    const zaloText = t('contact_page.zalo') || 'Liên hệ Zalo';
    const messengerText = t('contact_page.messenger') || 'Gửi tin nhắn Messenger';
    const whatsappText = t('contact_page.whatsapp') || 'Liên hệ WhatsApp';
    const instagramChatText = t('contact_page.instagram_chat') || 'Chat Instagram';
    
    const addressText = t('footer.address');
    const hotlineText = t('footer.hotline');
    
    // === CẬP NHẬT LINK MAP MỚI TẠI ĐÂY ===
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15676.962954547535!2d106.735246!3d10.792865!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763a679086b%3A0x86427b75c9201eb9!2zTmFua3kgQmVhdXR5IC0gTuG7kWkgbWkgY2h1ecOqbiBuZ2hp4buHcA!5e0!3m2!1svi!2sus!4v1762907838642!5m2!1svi!2sus";

    const zaloNumber = '0852759678';
    const fbMessengerUrl = 'https://m.me/nanky.beaute';
    const whatsappUrl = 'https://wa.me/qr/NYRFHAP4FOWQN1'; 
    const instagramChatUrl = 'https://ig.me/nanky.beaute'; 
    
    const socialLinksRaw = t('footer.social_links');
    const socialLinks = Array.isArray(socialLinksRaw) ? socialLinksRaw : [];
    const facebookUrl = socialLinks.find(l => l.name === 'Facebook')?.url || '#';
    const instagramUrl = socialLinks.find(l => l.name === 'Instagram')?.url || '#';
    const tiktokUrl = socialLinks.find(l => l.name === 'TikTok')?.url || '#';
    
    const allSocialUrls = socialLinks.map(link => link.url).filter(url => url && url.startsWith('https://'));
    allSocialUrls.push(`https://zalo.me/${zaloNumber}`);
    allSocialUrls.push(whatsappUrl); 
    allSocialUrls.push(fbMessengerUrl); 

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BeautySalon",
        "name": "Nanky Beauty",
        "image": `${URL}/images/logos/logo.png`, 
        "url": "https://nankybeauty.com",
        "sameAs": allSocialUrls,
        "telephone": "+84852759678",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "71 Vành Đai Tây, Phường An Khánh",
            "addressLocality": "Quận 2",
            "addressRegion": "TP. HCM",
            "postalCode": "700000",
            "addressCountry": "VN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 10.7937, 
            "longitude": 106.7441
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "08:00",
                "closes": "21:00"
            }
        ]
    };
    
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${URL}${router.asPath}`} />
                <meta property="og:site_name" content={globalSeo.site_name} />
                <meta property="og:image" content={`${URL}${ogImage}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={seoData.description} />
                <meta name="twitter:image" content={`${URL}${ogImage}`} />

                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                {renderHreflangTags(router.asPath, SUPPORTED_LANGS)}
            </Head>

            <Header />
            <PageHeader>{pageHeaderText}</PageHeader>
            <ContactPageWrapper>
                <ContactInfoContainer>
                    <CtaTitle>{ctaHeader}</CtaTitle>
                    
                    <motion.a 
                        href={`https://zalo.me/${zaloNumber}`}
                        target="_blank"
                        style={{ width: '80%', maxWidth: '350px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CtaButton as="button" style={{ 
                            backgroundColor: '#0068ff', 
                            backgroundImage: 'none',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(0, 104, 255, 0.4)',
                        }}>
                            💬 {zaloText} ({zaloNumber})
                        </CtaButton>
                    </motion.a>

                    <motion.a 
                        href={fbMessengerUrl}
                        target="_blank"
                        style={{ width: '80%', maxWidth: '350px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CtaButton as="button" style={{ 
                            backgroundColor: '#0099ff', 
                            backgroundImage: 'none',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(0, 153, 255, 0.4)',
                        }}>
                            {messengerText}
                        </CtaButton>
                    </motion.a>
                    
                    <motion.a 
                        href={whatsappUrl}
                        target="_blank"
                        style={{ width: '80%', maxWidth: '350px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CtaButton as="button" style={{ 
                            backgroundColor: '#25D366',
                            backgroundImage: 'none',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                        }}>
                            🟢 {whatsappText}
                        </CtaButton>
                    </motion.a>
                    
                    <motion.a 
                        href={instagramChatUrl}
                        target="_blank"
                        style={{ width: '80%', maxWidth: '350px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CtaButton as="button" style={{ 
                            background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(220, 39, 67, 0.4)',
                        }}>
                            📸 {instagramChatText}
                        </CtaButton>
                    </motion.a>

                    <div style={{marginTop: '30px', borderTop: '1px dashed #eee', paddingTop: '20px', width: '100%', maxWidth: '350px'}}>
                        <p style={{ color: '#555', marginBottom: '15px', fontWeight: '600' }}>{t('footer.social_title')}:</p>
                        <SocialIconsContainer>
                            <SocialLinkButton href={facebookUrl} target="_blank" style={{ backgroundColor: '#4267B2' }}><div>f</div></SocialLinkButton>
                            <SocialLinkButton href={instagramUrl} target="_blank" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)' }}><div>📸</div></SocialLinkButton>
                            <SocialLinkButton href={tiktokUrl} target="_blank" style={{ backgroundColor: '#000' }}><div>🎵</div></SocialLinkButton>
                        </SocialIconsContainer>
                    </div>
                    <p style={{ marginTop: '20px', color: '#555' }}>{hotlineText}</p>
                    <p style={{ color: '#555' }}>{addressText}</p>
                </ContactInfoContainer>
                
                <MapContainer>
                    <iframe 
                        src={mapEmbedUrl}
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Bản đồ địa chỉ Nanky Beauty tại Quận 2, TP. HCM"
                    />
                </MapContainer>
            </ContactPageWrapper>
            <Footer />
        </>
    );
};

export default ContactPage;