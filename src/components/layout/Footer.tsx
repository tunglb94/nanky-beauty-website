import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// *** ĐÃ THAY THẾ HÀM MOCK BẰNG IMPORT HOOK THỰC TẾ ***
import { useI18n } from '../../hooks/useI18n'; 
// ******************************************************

const FooterWrapper = styled.footer`
  background-color: #1a1a1a; /* NỀN ĐEN TỐI */
  color: #aaa;
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

  /* *** MOBILE OPTIMIZATION: STACK COLUMNS *** */
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
    
    &:nth-child(4) { /* Căn giữa Social Icons */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
  }
`;

const FooterLogo = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
  color: #FFD700; /* Vàng rực */
  margin-bottom: 20px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ContactInfo = styled.p`
  margin: 5px 0;
  line-height: 1.6;
  
  &.legal {
    font-size: 0.8rem;
    color: #999; 
    margin: 3px 0;
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

const FooterHeading = styled.h4`
  color: #FFD700; /* Vàng Đồng */
  font-family: 'Inter', sans-serif; 
  font-weight: 600;
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
`;

const FacebookIcon = styled(IconBase)`
    background-color: #4267B2; /* Màu xanh FB chính thức */
    border-radius: 50%;
    color: #fff;
    font-size: 1.2rem;
    &::before {
        content: "f";
        font-family: Arial, sans-serif; 
        font-weight: bold;
    }
`;

const InstagramIcon = styled(IconBase)`
    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
    border-radius: 25%;
    color: #fff;
    &::before {
        content: "📸";
        font-size: 0.9em;
        filter: invert(100%); 
    }
`;

const ZaloIcon = styled(IconBase)`
    background-color: #00A1F3; 
    border-radius: 50%;
    color: #fff;
    font-size: 1.2em;
    &::before {
        content: "Z";
        font-family: 'Inter', sans-serif;
    }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 180px; 
  overflow: hidden;
  border: 1px solid #444; 
  border-radius: 4px;

  @media (max-width: 768px) {
    height: 150px;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Copyright = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #777;
`;

const Footer: React.FC = () => {
  const { t } = useI18n();
  const socialLinks = t('footer.social_links') as { name: string; url: string; icon: string }[];

  return (
    <FooterWrapper>
      <FooterGrid>
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

        <Column>
          <FooterHeading>{t('footer.location_title')}</FooterHeading>
          <MapContainer>
            {/* ĐÃ CẬP NHẬT MÃ IFRAME MỚI CỦA BẠN */}
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2407360289103!2d106.735243!3d10.792865199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763a679086b%3A0x86427b75c9201eb9!2zTmFua3kgQmVhdXR5IC0gTuG7kWkgbWkgY2h1ecOqbiBuZ2hp4buHcA!5e0!3m2!1svi!2s!4v1760305589991!5m2!1svi!2s" 
                width="600" 
                height="450" 
                style={{border:0}} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ địa chỉ Nanky Beauty tại Quận 2, TP. HCM">
            </iframe>
          </MapContainer>
        </Column>

        <Column>
          <FooterHeading>{t('header.services')}</FooterHeading>
          <ContactInfo>{t('service_0_title')}</ContactInfo>
          <ContactInfo>{t('service_1_title')}</ContactInfo>
          <ContactInfo>{t('service_2_title')}</ContactInfo>
          <ContactInfo>{t('service_3_title')}</ContactInfo>
        </Column>

        <Column>
          <FooterHeading>{t('footer.social_title')}</FooterHeading>
          <SocialIcons>
            <SocialLink 
                href={socialLinks.find(l => l.name === 'Facebook')?.url}
                target="_blank"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
            >
                <FacebookIcon />
            </SocialLink>
            <SocialLink 
                href={socialLinks.find(l => l.name === 'Instagram')?.url} 
                target="_blank"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
            >
                <InstagramIcon />
            </SocialLink>
            <SocialLink 
                href={socialLinks.find(l => l.name === 'Zalo')?.url} 
                target="_blank"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
            >
                <ZaloIcon />
            </SocialLink>
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