import React from 'react';
import styled from 'styled-components';

const SeoPanelWrapper = styled.div`
  margin-top: 30px;
  border: 1px dashed #C6A500;
  border-radius: 8px;
  background-color: #fffaf0; // Nền vàng rất nhạt
`;

const Header = styled.div`
  padding: 15px 20px;
  background-color: #C6A500;
  color: #111;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
`;

const FormContent = styled.div`
  padding: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
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
`;

const HelperText = styled.p`
  font-size: 0.85rem;
  color: #777;
  margin-top: 5px;
`;

const CharCounter = styled.span<{ $isOptimal: boolean }>`
  font-weight: bold;
  color: ${({ $isOptimal }) => ($isOptimal ? '#2ecc71' : '#f39c12')};
`;

interface SeoEditorPanelProps {
    seoData: {
        title?: string;
        description?: string;
        keywords?: string;
    };
    onUpdate: (field: 'title' | 'description' | 'keywords', value: string) => void;
    titlePrefix?: string;
}

const SeoEditorPanel: React.FC<SeoEditorPanelProps> = ({ seoData, onUpdate, titlePrefix = '' }) => {
    const title = seoData?.title || '';
    const description = seoData?.description || '';
    
    const finalTitle = `${titlePrefix}${title}`;
    const isTitleOptimal = finalTitle.length >= 50 && finalTitle.length <= 60;
    const isDescOptimal = description.length >= 120 && description.length <= 158;

    return (
        <SeoPanelWrapper>
            <Header>🚀 Tối ưu hóa SEO cho mục này</Header>
            <FormContent>
                <InputGroup>
                    <label htmlFor="seoTitle">Thẻ Tiêu đề (Title Tag)</label>
                    <input id="seoTitle" type="text" value={title} onChange={(e) => onUpdate('title', e.target.value)} />
                    <HelperText>
                        Độ dài tối ưu: 50-60 ký tự. Hiện tại: <CharCounter $isOptimal={isTitleOptimal}>{finalTitle.length}</CharCounter> ký tự.
                    </HelperText>
                </InputGroup>
                <InputGroup>
                    <label htmlFor="seoDescription">Thẻ Mô tả (Meta Description)</label>
                    <textarea id="seoDescription" rows={4} value={description} onChange={(e) => onUpdate('description', e.target.value)} />
                    <HelperText>
                        Độ dài tối ưu: 120-158 ký tự. Hiện tại: <CharCounter $isOptimal={isDescOptimal}>{description.length}</CharCounter> ký tự.
                    </HelperText>
                </InputGroup>
                <InputGroup>
                    <label htmlFor="seoKeywords">Từ khóa (Keywords)</label>
                    <input id="seoKeywords" type="text" value={seoData?.keywords || ''} onChange={(e) => onUpdate('keywords', e.target.value)} />
                    <HelperText>
                        Các từ khóa chính, cách nhau bởi dấu phẩy.
                    </HelperText>
                </InputGroup>
            </FormContent>
        </SeoPanelWrapper>
    );
};

export default SeoEditorPanel;