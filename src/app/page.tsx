'use client';

import { EmployeeProvider } from '@/context/EmployeeContext';
import Header from '@/components/Header';
import TabsBar from '@/components/TabsBar';
import Toast from '@/components/Toast';
import PrintReport from '@/components/PrintReport';
import SalariesTab from '@/components/tabs/SalariesTab';
import CardsTab from '@/components/tabs/CardsTab';
import DeptsTab from '@/components/tabs/DeptsTab';
import AnalyticsTab from '@/components/tabs/AnalyticsTab';
import ReportsTab from '@/components/tabs/ReportsTab';
import EmployeeModal from '@/components/modals/EmployeeModal';
import DeleteModal from '@/components/modals/DeleteModal';
import RaiseModal from '@/components/modals/RaiseModal';
import DeptModal from '@/components/modals/DeptModal';
import { useEmployees } from '@/context/EmployeeContext';
import { useRouter } from 'next/navigation';

function SkeletonLoader() {
  return (
    <div style={{ padding:'28px', maxWidth:1700, margin:'0 auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:28 }}>
        {Array.from({ length:5 }).map((_,i) => (
          <div key={i} className={`skeleton stagger-${i+1}`} style={{ height:96, borderRadius:14 }} />
        ))}
      </div>
      <div style={{ background:'var(--card)', borderRadius:16, border:'1px solid var(--border2)', overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border2)' }}>
          <div className="skeleton" style={{ height:15, width:160, borderRadius:6 }} />
        </div>
        {Array.from({ length:8 }).map((_,i) => (
          <div key={i} style={{ padding:'14px 22px', borderBottom:'1px solid var(--border2)', display:'flex', gap:16, alignItems:'center' }}>
            <div className="skeleton" style={{ width:28, height:28, borderRadius:'50%', flexShrink:0 }} />
            <div className="skeleton" style={{ height:13, flex:2, borderRadius:6 }} />
            <div className="skeleton" style={{ height:13, flex:1, borderRadius:6 }} />
            <div className="skeleton" style={{ height:22, width:70, borderRadius:8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AppShell() {
  const { activeTab, modal, loading } = useEmployees();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <div style={{ position:'relative', zIndex:1 }}>
        <Header onLogout={handleLogout} />
        <TabsBar />
        {loading ? (
          <SkeletonLoader />
        ) : (
          <main key={activeTab} className="animate-fade-in-up"
            style={{ padding:'26px 28px', maxWidth:1700, margin:'0 auto' }}
            data-no-print>
            {activeTab === 'salaries'  && <SalariesTab />}
            {activeTab === 'cards'     && <CardsTab />}
            {activeTab === 'depts'     && <DeptsTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'reports'   && <ReportsTab />}
          </main>
        )}
      </div>

      <PrintReport />

      {modal?.type === 'add'    && <EmployeeModal mode="add" />}
      {modal?.type === 'edit'   && <EmployeeModal mode="edit" employee={modal.employee} />}
      {modal?.type === 'delete' && <DeleteModal employee={modal.employee} />}
      {modal?.type === 'raise'  && <RaiseModal   employee={modal.employee} />}
      {modal?.type === 'dept'   && <DeptModal    dept={modal.dept} />}

      <Toast />
    </>
  );
}

export default function Home() {
  return (
    <EmployeeProvider>
      <AppShell />
    </EmployeeProvider>
  );
}
