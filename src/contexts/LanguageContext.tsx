import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    nav_title: 'Seoul Hanmaum Rotary Club presents Monthly Member Highlights',
    title: 'Rotary Club Member Highlights',
    subtitle: 'Celebrating members in Seoul Hanmaum Rotary Club and Rotary International District 3650',
    form_name: 'Full Name',
    form_club: 'Club Name',
    form_email: 'Email Address',
    form_phone: 'Phone Number',
    form_role: 'Professional Title',
    form_company: 'Company / Organization',
    form_highlight_title: 'Highlight Title (Short)',
    form_highlight: 'Career Highlight (Body)',
    form_writing_tip_title: 'Writing Tip: 3rd Person POV',
    form_writing_tip_body: 'We encourage you to write your highlight in the 3rd person (e.g., "John Smith was recently elected..." instead of "I was recently elected..."). This makes it easier for the PR chair to use in the newsletter!',
    form_photo: 'Upload Photo',
    form_submit: 'Submit Highlight',
    form_update: 'Update Submission',
    form_consent: "I understand this information will be shared in the public ClubRunner newsletter.",
    form_district_note: 'Members outside Seoul Hanmaum must provide full club details.',
    nav_home: 'Home',
    nav_admin: 'Admin',
    auth_login: 'Sign in to Submit',
    auth_logout: 'Sign Out',
    success_msg: 'Thank you for your submission!',
    error_msg: 'Something went wrong. Please try again.',
  },
  ko: {
    nav_title: '서울 한마음 로타리 클럽: 이달의 회원 하이라이트',
    title: '로타리 클럽 회원 하이라이트',
    subtitle: '서울 한마음 로타리 클럽 및 국제로타리 3650지구 회원들의 성취를 축하합니다',
    form_name: '성함',
    form_club: '소속 클럽',
    form_email: '이메일 주소',
    form_phone: '전화번호',
    form_role: '직함',
    form_company: '직장 / 조직',
    form_highlight_title: '하이라이트 제목 (요약)',
    form_highlight: '이달의 직업적 성과 (본문)',
    form_writing_tip_title: '작성 팁: 3인칭 시점',
    form_writing_tip_body: '하이라이트를 3인칭 시점(예: "홍길동 회원은 최근...을 달성했습니다" 등)으로 작성해 주시기를 권장합니다. 이는 뉴스레터 발행 과정을 훨씬 수월하게 만듭니다!',
    form_photo: '사진 업로드',
    form_submit: '하이라이트 제출',
    form_update: '제출 내용 수정',
    form_consent: '이 정보가 공개용 ClubRunner 뉴스레터에 게재되는 것에 동의합니다.',
    form_district_note: '서울 한마음 로타리 외 회원은 소속 클럽명을 정확히 기재해 주세요.',
    nav_home: '홈',
    nav_admin: '관리자',
    auth_login: '로그인 후 제출하기',
    auth_logout: '로그아웃',
    success_msg: '제출해 주셔서 감사합니다!',
    error_msg: '문제가 발생했습니다. 다시 시도해 주세요.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
