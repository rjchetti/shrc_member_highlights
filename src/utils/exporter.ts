export interface Submission {
  fullName: string;
  clubName: string;
  professionalTitle: string;
  company: string;
  highlightText: string;
  photoUrl: string;
  id: string;
}

export const generateClubRunnerHTML = (submissions: Submission[], language: 'en' | 'ko') => {
  const isEn = language === 'en';
  
  const styles = `
    <style>
      .rh-container { font-family: 'Open Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; }
      .rh-header { background-color: #003399; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .rh-card { border: 1px solid #dddddd; margin: 20px 0; border-radius: 8px; overflow: hidden; background: #ffffff; }
      .rh-image { width: 100%; height: 250px; object-fit: cover; }
      .rh-content { padding: 20px; }
      .rh-name { color: #003399; font-size: 20px; font-weight: bold; margin: 0; }
      .rh-club { color: #888888; font-size: 14px; margin: 5px 0 15px 0; }
      .rh-meta { font-weight: bold; color: #333333; margin-bottom: 10px; }
      .rh-highlight { line-height: 1.6; color: #444444; }
      .rh-footer { text-align: center; font-size: 12px; color: #999999; margin-top: 30px; }
    </style>
  `;

  const cards = submissions.map(sub => `
    <div class="rh-card">
      <img src="${sub.photoUrl || 'https://placehold.co/600x300@2x.png?text=Member+Highlight'}" class="rh-image" alt="Profile" />
      <div class="rh-content">
        <h3 class="rh-name">${sub.fullName}</h3>
        <p class="rh-club">${sub.clubName}</p>
        <div class="rh-meta">${sub.professionalTitle} @ ${sub.company}</div>
        <p class="rh-highlight">${sub.highlightText}</p>
      </div>
    </div>
  `).join('');

  return `
    <html>
      <head>${styles}</head>
      <body>
        <div class="rh-container">
          <div class="rh-header">
            <h1>${isEn ? 'Member Highlights' : '회원 하이라이트'}</h1>
            <p>${isEn ? 'Professional Achievements' : '전문직 서비스 성취'}</p>
          </div>
          ${cards}
          <div class="rh-footer">
            © ${new Date().getFullYear()} Seoul Hanmaum Rotary Club - District 3650
          </div>
        </div>
      </body>
    </html>
  `;
};
