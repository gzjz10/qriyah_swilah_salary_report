'use client';

import Image from 'next/image';

const SUGGESTED = [
  'ما إجمالي مرتبات قسم الإدارة؟',
  'من هم أعلى 5 موظفين راتباً؟',
  'كم عدد الموظفين في كل فرع؟',
  'ما متوسط الراتب في كل قسم؟',
  'أي قسم يستهلك أكبر نسبة من ميزانية الرواتب؟',
  'أعطني تحليلاً موجزاً لتوزيع الرواتب',
];

interface Props {
  onSelect: (q: string) => void;
}

export default function WelcomeScreen({ onSelect }: Props) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px 160px',
      textAlign: 'center',
    }}>
      {/* Avatar */}
      <div
        className="animate-scale-in"
        style={{
          width: 88, height: 88, borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid var(--amber-light)',
          boxShadow: '0 8px 32px rgba(245,166,35,0.40), 0 0 0 10px rgba(245,166,35,0.08)',
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        <Image src="/logo.jpg" alt="شعار قرية صويلح" width={88} height={88} style={{ objectFit: 'cover' }} priority />
      </div>

      {/* Title */}
      <h1 className="animate-fade-in stagger-1" style={{
        fontSize: 28,
        fontWeight: 900,
        background: 'linear-gradient(135deg, var(--amber-bright) 0%, var(--teal-light) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: '0 0 10px',
        lineHeight: 1.2,
      }}>
        المستشار الذكي
      </h1>

      <p className="animate-fade-in stagger-2" style={{
        fontSize: 14,
        color: 'var(--text3)',
        margin: '0 0 8px',
        maxWidth: 380,
        lineHeight: 1.6,
      }}>
        مستشار أعمال ذكي لتحليل بيانات الرواتب والموظفين
      </p>
      <p className="animate-fade-in stagger-2" style={{
        fontSize: 13,
        color: 'var(--text3)',
        margin: '0 0 36px',
      }}>
        شركة قرية صويلح للتجارة
      </p>

      {/* Divider */}
      <div className="animate-fade-in stagger-3" style={{
        width: 80, height: 3, borderRadius: 2,
        background: 'linear-gradient(90deg, var(--amber-light), var(--teal-light))',
        marginBottom: 36,
      }} />

      {/* Suggested questions */}
      <div className="animate-fade-in stagger-3" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: 10,
        maxWidth: 680,
        width: '100%',
      }}>
        {SUGGESTED.map((q, i) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className={`stagger-${Math.min(i + 1, 6)}`}
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--border2)',
              borderRadius: 12,
              padding: '14px 18px',
              textAlign: 'right',
              cursor: 'pointer',
              color: 'var(--text2)',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.5,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--amber-light)';
              e.currentTarget.style.background = 'var(--amber-glow)';
              e.currentTarget.style.color = 'var(--amber-light)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,166,35,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border2)';
              e.currentTarget.style.background = 'var(--bg-glass)';
              e.currentTarget.style.color = 'var(--text2)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
