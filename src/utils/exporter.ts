export interface Submission {
  fullName: string;
  clubName: string;
  professionalTitle: string;
  company: string;
  highlightTitle: string;
  highlightText: string;
  photoUrl: string;
  id: string;
  status: 'pending' | 'archived';
  submittedAt: any; // Using any for Timestamp compatibility
}

export const generateClubRunnerHTML = (submissions: Submission[], language: 'en' | 'ko') => {
  const isEn = language === 'en';
  
  const styles = `
    <style>
      .rh-container { font-family: 'Open Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; }
      .rh-header { background-color: #003399; color: #ffffff; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
      .rh-card { border: 1px solid #e0e0e0; margin: 25px 0; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
      .rh-image-container { width: 100%; height: 300px; overflow: hidden; }
      .rh-image { width: 100%; height: 100%; object-fit: cover; }
      .rh-content { padding: 25px; }
      .rh-name { color: #003399; font-size: 24px; font-weight: bold; margin: 0; }
      .rh-club { color: #018ad8; font-size: 14px; font-weight: 600; margin: 5px 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px; }
      .rh-meta { font-size: 15px; font-weight: 600; color: #555555; margin-bottom: 20px; border-bottom: 2px solid #003399; display: inline-block; padding-bottom: 2px;}
      .rh-update-title { font-size: 18px; font-weight: 700; color: #333333; margin-bottom: 12px; }
      .rh-highlight { line-height: 1.7; color: #444444; font-size: 16px; }
      .rh-highlight a { color: #018ad8; text-decoration: underline; font-weight: 600; }
      .rh-highlight b { color: #003399; }
      .rh-footer { text-align: center; font-size: 12px; color: #777777; margin-top: 40px; border-top: 1px solid #dddddd; padding-top: 20px; }
    </style>
  `;

  const cards = submissions.map(sub => `
    <div class="rh-card">
      <div class="rh-image-container">
        <img src="${sub.photoUrl || 'https://placehold.co/600x400@2x.png?text=Rotary+Member'}" class="rh-image" alt="Profile" />
      </div>
      <div class="rh-content">
        <h3 class="rh-name">${sub.fullName}</h3>
        <p class="rh-club">${sub.clubName}</p>
        <div class="rh-meta">${sub.professionalTitle} @ ${sub.company}</div>
        ${sub.highlightTitle ? `<div class="rh-update-title">${sub.highlightTitle}</div>` : ''}
        <div class="rh-highlight">${sub.highlightText}</div>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        ${styles}
      </head>
      <body>
        <div class="rh-container">
          <div class="rh-header">
            <img src="https://www.rotary.org/sites/all/themes/rotary_foundation/favicons/favicon-32x32.png" style="width:32px; margin-bottom:10px;" />
            <h1 style="margin:0; font-size: 28px;">${isEn ? 'Member Highlights' : '회원 하이라이트'}</h1>
            <p style="margin:5px 0 0; opacity:0.9;">${isEn ? 'Professional Achievements & Milestones' : '전문직 서비스 성취 및 이정표'}</p>
          </div>
          ${cards}
          <div class="rh-footer">
            <p>© ${new Date().getFullYear()} Seoul Hanmaum Rotary Club - District 3650</p>
            <p>${isEn ? 'Service Above Self' : '초아의 봉사'}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
