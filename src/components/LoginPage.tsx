'use client';

import { useState } from 'react';
import { Building2, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';

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

    // simulate a brief check delay for polish
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

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12,
    padding: '13px 46px 13px 16px',
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 180ms ease, box-shadow 180ms ease',
    boxShadow: focused ? '0 0 0 3px rgba(200,150,62,0.12)' : 'none',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      zIndex: 1,
    }}>

      {/* Card */}
      <div
        className="animate-scale-in"
        style={{
          background: 'rgba(10,15,28,0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: '44px 40px 40px',
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,150,62,0.06)',
          animation: shake ? 'shake 0.45s ease' : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(200,150,62,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>
            <Building2 size={30} color="#fff" strokeWidth={2} />
          </div>
          <div style={{
            fontSize: 22, fontWeight: 900,
            background: 'linear-gradient(135deg, var(--gold-light), #fff 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            شركة قرية صويلح
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
            نظام إدارة المرتبات والأجور
          </div>
        </div>

        {/* Security badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          background: 'rgba(34,197,94,0.07)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 10, padding: '9px 16px',
          marginBottom: 28,
          fontSize: 12, fontWeight: 600, color: 'var(--green)',
        }}>
          <ShieldCheck size={14} strokeWidth={2.5} />
          منطقة مؤمّنة — يتطلب صلاحية الدخول
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text3)', marginBottom: 8, letterSpacing: '0.03em' }}>
              اسم المستخدم
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="أدخل اسم المستخدم"
                required
                style={inputStyle(false)}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'var(--gold)', boxShadow: '0 0 0 3px rgba(200,150,62,0.12)' })}
                onBlur={(e)  => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none' })}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text3)', marginBottom: 8, letterSpacing: '0.03em' }}>
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                style={{ ...inputStyle(false), paddingLeft: 46 }}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'var(--gold)', boxShadow: '0 0 0 3px rgba(200,150,62,0.12)' })}
                onBlur={(e)  => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none' })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text3)', display: 'flex', alignItems: 'center',
                  padding: 2, transition: 'color 180ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text2)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="animate-fade-in" style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, fontWeight: 600, color: 'var(--red)',
              marginBottom: 18, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username || !password}
            style={{
              width: '100%',
              background: loading
                ? 'rgba(200,150,62,0.4)'
                : 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: 12,
              fontFamily: 'inherit',
              fontSize: 15,
              fontWeight: 800,
              cursor: loading || !username || !password ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : '0 6px 20px rgba(200,150,62,0.4)',
              transition: 'all 180ms ease',
              opacity: !username || !password ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading && username && password) {
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(200,150,62,0.6)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 20px rgba(200,150,62,0.4)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                جارٍ التحقق...
              </>
            ) : (
              <>
                <LogIn size={16} strokeWidth={2.5} />
                دخول
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--text3)' }}>
          © {new Date().getFullYear()} شركة قرية صويلح — جميع الحقوق محفوظة
        </div>
      </div>

      {/* shake keyframe */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
