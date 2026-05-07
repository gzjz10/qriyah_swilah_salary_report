// U+20C1 — official Saudi Riyal symbol (Unicode 17, 2025)
// Rendered via @font-face unicode-range in globals.css — no component changes needed
export const SAR = '⃁';
export const fmt = (n: number) => n.toLocaleString('en-SA') + ' ' + SAR;

export const DEPT_COLORS: Record<string, string> = {
  الإدارة:    '#F5A623',
  التسويق:    '#3DC8D5',
  المستودع:   '#FB923C',
  المعارض:    '#22C55E',
  خدمات:     '#8B5CF6',
  المشتريات: '#F43F5E',
};

export const DEPT_ACCENT: Record<string, { bg: string; text: string; border: string }> = {
  الإدارة:    { bg: 'rgba(245,166,35,0.12)',  text: '#F5A623', border: 'rgba(245,166,35,0.35)' },
  التسويق:    { bg: 'rgba(61,200,213,0.12)',  text: '#3DC8D5', border: 'rgba(61,200,213,0.35)' },
  المستودع:   { bg: 'rgba(251,146,60,0.12)', text: '#FB923C', border: 'rgba(251,146,60,0.35)' },
  المعارض:    { bg: 'rgba(34,197,94,0.12)',   text: '#22C55E', border: 'rgba(34,197,94,0.35)'  },
  خدمات:     { bg: 'rgba(139,92,246,0.12)',  text: '#8B5CF6', border: 'rgba(139,92,246,0.35)' },
  المشتريات: { bg: 'rgba(244,63,94,0.12)',   text: '#F43F5E', border: 'rgba(244,63,94,0.35)'  },
};

export const DEPT_LIST   = ['الإدارة', 'التسويق', 'المستودع', 'المعارض', 'خدمات', 'المشتريات'];
export const BRANCH_LIST = ['قرطبة', 'مستودع الشفا', 'مستودع قوين'];

export const getInitials = (name: string) =>
  (name || '').split(' ').slice(0, 2).map((w) => w[0] || '').join('');

export const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return 'rank-other';
};
