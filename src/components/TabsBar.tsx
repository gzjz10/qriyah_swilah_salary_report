'use client';

import { LayoutList, CreditCard, Building, BarChart2, FileText } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';
import type { Tab } from '@/types';

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'salaries',   label: 'المرتبات والأجور',  Icon: LayoutList },
  { id: 'cards',      label: 'بطاقات الموظفين',   Icon: CreditCard },
  { id: 'depts',      label: 'لوحة الأقسام',      Icon: Building   },
  { id: 'analytics',  label: 'التحليلات',          Icon: BarChart2  },
  { id: 'reports',    label: 'التقارير',            Icon: FileText   },
];

export default function TabsBar() {
  const { activeTab, setActiveTab } = useEmployees();

  return (
    <nav
      data-no-print
      style={{
        background: 'rgba(10,14,26,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border2)',
        padding: '0 28px',
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = id === activeTab;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            aria-selected={active}
            role="tab"
            style={{
              padding: '13px 18px',
              background: active ? 'rgba(200,150,62,0.07)' : 'none',
              border: 'none',
              borderBottom: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
              color: active ? 'var(--gold-light)' : 'var(--text3)',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              marginBottom: -1,
              whiteSpace: 'nowrap',
              transition: 'all var(--transition)',
              borderRadius: active ? '8px 8px 0 0' : 0,
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.color = 'var(--text2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.color = 'var(--text3)';
                e.currentTarget.style.background = 'none';
              }
            }}
          >
            <Icon size={14} strokeWidth={active ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
