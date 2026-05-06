export const fmt = (n: number) =>
  n.toLocaleString('en-SA') + ' ر.س';

export const DEPT_COLORS: Record<string, string> = {
  الإدارة: '#E8B86D',
  التسويق: '#F472B6',
  المستودع: '#FB923C',
  المعارض: '#22C55E',
  خدمات: '#60A5FA',
};

export const DEPT_ICONS: Record<string, string> = {
  الإدارة: 'admin',
  التسويق: 'marketing',
  المستودع: 'warehouse',
  المعارض: 'showroom',
  خدمات: 'services',
};

export const BRANCH_LABELS: Record<string, string> = {
  قرطبة: 'قرطبة',
  'مستودع الشفا': 'مستودع الشفا',
  'مستودع قوين': 'مستودع قوين',
};

export const DEPT_LIST = ['الإدارة', 'التسويق', 'المستودع', 'المعارض', 'خدمات'];
export const BRANCH_LIST = ['قرطبة', 'مستودع الشفا', 'مستودع قوين'];

export const getInitials = (name: string) =>
  (name || '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('');

export const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return 'rank-other';
};

export const DEPT_ACCENT: Record<string, { bg: string; text: string; border: string }> = {
  الإدارة: { bg: 'rgba(200,150,62,0.12)', text: '#E8B86D', border: 'rgba(200,150,62,0.35)' },
  التسويق: { bg: 'rgba(236,72,153,0.12)', text: '#F472B6', border: 'rgba(236,72,153,0.35)' },
  المستودع: { bg: 'rgba(249,115,22,0.12)', text: '#FB923C', border: 'rgba(249,115,22,0.35)' },
  المعارض: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E', border: 'rgba(34,197,94,0.35)' },
  خدمات: { bg: 'rgba(59,130,246,0.12)', text: '#60A5FA', border: 'rgba(59,130,246,0.35)' },
};
