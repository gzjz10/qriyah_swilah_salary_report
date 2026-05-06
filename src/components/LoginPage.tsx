'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';

interface Props { onLogin: () => void; }

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [shake,    setShake]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (username.trim() === 'admin' && password === '123456') {
      sessionStorage.setItem('qs_auth', '1');
      onLogin();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const canSubmit = username.trim() && password && !loading;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', zIndex: 1,
    }}>

      {/* Card */}
      <div
        className="animate-scale-in"
        style={{
          background: 'rgba(8,11,20,0.90)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(245,166,35,0.20)',
          borderRadius: 24,
          padding: '44px 40px 40px',
          width: '100%', maxWidth: 400,
          boxShadow: '0 32px 80px rgba(0,0,0,0.70), 0 0 0 1px rgba(61,200,213,0.05)',
          animation: shake ? 'shake 0.45s ease' : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, margin: '0 auto 16px',
            borderRadius: 22, overflow: 'hidden', background: '#fff',
            boxShadow: '0 8px 32px rgba(245,166,35,0.40), 0 0 0 4px rgba(245,166,35,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image src="/logo.jpg" alt="شعار قرية صويلح" width={80} height={80} style={{ objectFit: 'cover' }} priority />
          </div>

          <div style={{
            fontSize: 24, fontWeight: 900,
            background: 'linear-gradient(135deg, var(--amber-bright) 0%, var(--teal-light) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 4,
          }}>
            شركة قرية صويلح
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>نظام إدارة المرتبات والأجور</div>
        </div>

        {/* Security badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          background: 'rgba(61,200,213,0.07)',
          border: '1px solid rgba(61,200,213,0.22)',
          borderRadius: 10, padding: '9px 16px', marginBottom: 28,
          fontSize: 12, fontWeight: 600, color: 'var(--teal-light)',
        }}>
          <ShieldCheck size={14} strokeWidth={2.5} />
          منطقة مؤمّنة — يتطلب صلاحية الدخول
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text3)', marginBottom: 7, letterSpacing: '0.03em' }}>
              اسم المستخدم
            </label>
            <input
              type="text" value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="أدخل اسم المستخدم"
              required
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: '13px 16px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 15, outline: 'none', transition: 'all 180ms ease' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--amber-light)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.12)'; }}
              onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text3)', marginBottom: 7, letterSpacing: '0.03em' }}>
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: '13px 16px 13px 46px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 15, outline: 'none', transition: 'all 180ms ease' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--amber-light)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.12)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'إخفاء' : 'إظهار'}
                style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', padding: 2, transition: 'color 180ms ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--teal-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-fade-in" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--red)', marginBottom: 18, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={!canSubmit}
            style={{
              width: '100%',
              background: canSubmit
                ? 'linear-gradient(135deg, var(--amber-light), var(--amber-dark))'
                : 'rgba(245,166,35,0.25)',
              color: '#fff', border: 'none',
              padding: '14px', borderRadius: 12,
              fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: canSubmit ? '0 6px 22px rgba(245,166,35,0.40)' : 'none',
              transition: 'all 180ms ease',
            }}
            onMouseEnter={(e) => { if (canSubmit) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(245,166,35,0.60)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canSubmit ? '0 6px 22px rgba(245,166,35,0.40)' : 'none'; }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                جارٍ التحقق...
              </>
            ) : (
              <><LogIn size={16} strokeWidth={2.5} /> دخول</>
            )}
          </button>
        </form>

        {/* Divider with teal accent */}
        <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(61,200,213,0.25))' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', opacity: 0.6 }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(61,200,213,0.25), transparent)' }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>
          © {new Date().getFullYear()} شركة قرية صويلح — جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
}
