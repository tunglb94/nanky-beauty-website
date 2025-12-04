import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n';

// --- Styled Components ---
const FooterWrapper = styled.footer`
  background-color: #1a1a1a;
  padding: 60px 80px 30px;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 40px 25px 20px;
  }
`;

const FooterGrid = styled.div`
  display: flex;
  gap: 60px;
  justify-content: space-between;
  border-bottom: 1px solid #444;
  padding-bottom: 40px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 200px;

  &:nth-child(1) { flex-basis: 30%; }
  &:nth-child(2) { flex-basis: 35%; }
  &:nth-child(3) { flex-basis: 15%; }
  &:nth-child(4) { flex-basis: 20%; }

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;

    &:nth-child(4) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
  }
`;

const FooterLogo = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
  color: #FFD700;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ContactInfo = styled.p`
  margin: 5px 0;
  line-height: 1.6;
  color: #bbb;

  &.legal {
    font-size: 0.8rem;
    color: #999; 
    margin: 3px 0;
  }

  a {
      color: #bbb;
      text-decoration: none;
      transition: color 0.2s ease;
      &:hover {
          color: #FFD700;
      }
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const FooterHeading = styled.h3`
  color: #FFD700;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 15px;
  margin-top: 25px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SocialLink = styled(motion.a)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.15) translateY(-3px);
  }
`;

const IconBase = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 700;
    transition: background-color 0.3s ease;
    border-radius: 50%;
`;

const FacebookIcon = styled(IconBase)`
    background-color: #4267B2;
    color: #fff;
    font-size: 1.2rem;
    &::before { content: "f"; font-family: Arial, sans-serif; font-weight: bold; }
`;

const InstagramIcon = styled(IconBase)`
    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
    border-radius: 25%;
    color: #fff;
    &::before { content: "📸"; font-size: 1.2em; }
`;

const ZaloIcon = styled(IconBase)`
    background-color: #00A1F3;
    color: #fff;
    font-size: 1.2em;
    &::before { content: "Z"; font-family: 'Inter', sans-serif; }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  border: 1px solid #444;
  border-radius: 4px;
  @media (max-width: 768px) { height: 150px; }
  iframe { width: 100%; height: 100%; border: none; }
`;

const Copyright = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #999;
`;

const Footer: React.FC = () => {
    const { t } = useI18n();

    const socialLinksData = t('footer.social_links');
    const socialLinks = Array.isArray(socialLinksData) ? socialLinksData : [];

    const facebookLink = socialLinks.find(l => l.name === 'Facebook');
    const instagramLink = socialLinks.find(l => l.name === 'Instagram');
    const zaloLink = socialLinks.find(l => l.name === 'Zalo');

    const FOOTER_SERVICE_KEYS: string[] = [
        'service_0_title', 'service_1_title', 'service_2_title', 'service_3_title',
        'service_7_title', 'service_5_title', 'service_9_title', 'service_8_title',
        'service_6_title', 'header.news'
    ];

    // === CẬP NHẬT LINK MAP MỚI TẠI ĐÂY ===
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15676.962954547535!2d106.735246!3d10.792865!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763a679086b%3A0x86427b75c9201eb9!2zTmFua3kgQmVhdXR5IC0gTuG7kWkgbWkgY2h1ecOqbiBuZ2hp4buHcA!5e0!3m2!1svi!2sus!4v1762907838642!5m2!1svi!2sus";

    return (
        <FooterWrapper>
            <FooterGrid>
                {/* Column 1 */}
                <Column>
                    <FooterLogo>Nanky Beauty</FooterLogo>
                    <FooterHeading>{t('footer.legal_title')}</FooterHeading>
                    <ContactInfo className="legal">{t('footer.business_reg_dept')}</ContactInfo>
                    <ContactInfo className="legal">{t('footer.hkd_name')}</ContactInfo>
                    <ContactInfo className="legal">{t('footer.hkd_code')}</ContactInfo>
                    <ContactInfo className="legal">{t('footer.reg_code')}</ContactInfo>
                    <FooterHeading>{t('footer.contact_title')}</FooterHeading>
                    <ContactInfo>{t('footer.address')}</ContactInfo>
                    <ContactInfo>{t('footer.hotline')}</ContactInfo>
                    <FooterHeading>{t('footer.hours_title')}</FooterHeading>
                    <ContactInfo>{t('footer.hours')}</ContactInfo>
                    <ContactInfo>{t('footer.days')}</ContactInfo>
                    <ContactInfo>{t('footer.parking')}</ContactInfo>
                </Column>
                {/* Column 2 */}
                <Column>
                    <FooterHeading>{t('footer.location_title')}</FooterHeading>
                    <MapContainer>
                        <iframe
                            src={mapEmbedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Bản đồ địa chỉ Nanky Beauty tại Quận 2, TP. HCM"
                            allowFullScreen
                        ></iframe>
                    </MapContainer>
                </Column>
                {/* Column 3 */}
                <Column>
                   <FooterHeading>{t('header.services')}</FooterHeading>
                    {FOOTER_SERVICE_KEYS.map((key) => {
                        const title = t(key);
                        if (typeof title === 'string' && !title.startsWith('[MISSING TRANSLATION:')) {
                            const href = key === 'header.news' ? '/news' : '/services';
                            return ( <ContactInfo key={key}> <a href={href}>{title}</a> </ContactInfo> );
                        }
                        return null;
                    })}
                </Column>
                {/* Column 4 */}
                <Column>
                    <FooterHeading>{t('footer.social_title')}</FooterHeading>
                    <SocialIcons>
                        {facebookLink?.url && (
                            <SocialLink href={facebookLink.url} target="_blank" rel="noopener noreferrer" aria-label={`Nanky Beauty trên ${facebookLink.name}`}> <FacebookIcon /> </SocialLink>
                        )}
                        {instagramLink?.url && (
                             <SocialLink href={instagramLink.url} target="_blank" rel="noopener noreferrer" aria-label={`Nanky Beauty trên ${instagramLink.name}`}> <InstagramIcon /> </SocialLink>
                        )}
                       {zaloLink?.url && (
                            <SocialLink href={zaloLink.url} target="_blank" rel="noopener noreferrer" aria-label={`Nanky Beauty trên ${zaloLink.name}`}> <ZaloIcon /> </SocialLink>
                       )}
                    </SocialIcons>
                </Column>
            </FooterGrid>
            <Copyright>
                © {new Date().getFullYear()} Nanky Beauty. All Rights Reserved. {t('footer.copyright_design')}
            </Copyright>
        </FooterWrapper>
    );
};

export default Footer;