'use client';

import React, {
  createContext, useContext, useEffect,
  useState, useCallback, useMemo,
} from 'react';
import type { Employee, ModalState, Tab } from '@/types';
import { fetchEmployees, insertEmployee, updateEmployee, deleteEmployee } from '@/lib/supabase';
import { SEED_EMPLOYEES } from '@/lib/seed-data';

const supabaseConfigured =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

export interface PrintFilter {
  dept:   string;
  branch: string;
  search: string;
}

interface Toast { message: string; visible: boolean; }

interface EmployeeContextValue {
  employees:     Employee[];
  loading:       boolean;
  activeTab:     Tab;
  setActiveTab:  (tab: Tab) => void;
  modal:         ModalState;
  openModal:     (state: ModalState) => void;
  closeModal:    () => void;
  toast:         Toast;
  showToast:     (msg: string) => void;
  // Shared filter (drives both tabs + print)
  printFilter:   PrintFilter;
  setPrintFilter:(f: Partial<PrintFilter>) => void;
  printEmployees:Employee[];   // filtered + sorted by salary desc
  addEmployee:   (emp: Omit<Employee, 'id'|'created_at'|'updated_at'>) => Promise<void>;
  editEmployee:  (id: number, updates: Partial<Employee>) => Promise<void>;
  removeEmployee:(id: number) => Promise<void>;
  raiseEmployee: (id: number, newSalary: number) => Promise<void>;
  printReport:   () => void;
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employees,    setEmployees]    = useState<Employee[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState<Tab>('salaries');
  const [modal,        setModal]        = useState<ModalState>(null);
  const [toast,        setToast]        = useState<Toast>({ message:'', visible:false });
  const [printFilter,  setPrintFilterRaw] = useState<PrintFilter>({ dept:'', branch:'', search:'' });

  const setPrintFilter = useCallback((f: Partial<PrintFilter>) =>
    setPrintFilterRaw((prev) => ({ ...prev, ...f })), []);

  // Derived: filtered employees for print
  const printEmployees = useMemo(() => {
    const q = printFilter.search.trim().toLowerCase();
    return employees
      .filter((e) => {
        const mQ = !q || e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q);
        const mD = !printFilter.dept   || e.dept   === printFilter.dept;
        const mB = !printFilter.branch || e.branch === printFilter.branch;
        return mQ && mD && mB;
      })
      .sort((a, b) => b.salary - a.salary);
  }, [employees, printFilter]);

  const load = useCallback(async () => {
    if (!supabaseConfigured) {
      setEmployees(SEED_EMPLOYEES.map((e) => ({ ...e })));
      setLoading(false);
      return;
    }
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch {
      setEmployees(SEED_EMPLOYEES.map((e) => ({ ...e })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  }, []);

  const openModal  = useCallback((state: ModalState) => setModal(state), []);
  const closeModal = useCallback(() => setModal(null), []);

  const addEmployee = useCallback(async (emp: Omit<Employee, 'id'|'created_at'|'updated_at'>) => {
    // Optimistic: add with temp ID immediately so UI reflects the change
    const tempId = Date.now();
    setEmployees((prev) => [...prev, { ...emp, id: tempId }]);
    showToast('تم إضافة الموظف بنجاح');

    if (supabaseConfigured) {
      try {
        const created = await insertEmployee(emp);
        // Replace temp entry with server entry (real ID)
        setEmployees((prev) =>
          prev.map((e) => e.id === tempId ? created : e)
        );
      } catch (err) {
        console.error('[Supabase] addEmployee failed:', err);
        showToast('تحذير: لم يتم الحفظ في قاعدة البيانات — تحقق من الإعدادات');
      }
    }
  }, [showToast]);

  const editEmployee = useCallback(async (id: number, updates: Partial<Employee>) => {
    // Optimistic: update local state immediately — modal can close right away
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, ...updates } : e));
    showToast('تم تحديث بيانات الموظف');

    if (supabaseConfigured) {
      try {
        const updated = await updateEmployee(id, updates);
        // Sync with server response (e.g. updated_at timestamp)
        setEmployees((prev) => prev.map((e) => e.id === id ? updated : e));
      } catch (err) {
        console.error('[Supabase] editEmployee failed:', err);
        showToast('تحذير: التعديل لم يُحفظ في قاعدة البيانات');
      }
    }
  }, [showToast]);

  const removeEmployee = useCallback(async (id: number) => {
    // Optimistic: remove immediately
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast('تم حذف الموظف');

    if (supabaseConfigured) {
      try {
        await deleteEmployee(id);
      } catch (err) {
        console.error('[Supabase] removeEmployee failed:', err);
        showToast('تحذير: الحذف لم يُطبّق في قاعدة البيانات');
      }
    }
  }, [showToast]);

  const raiseEmployee = useCallback(async (id: number, newSalary: number) => {
    // Optimistic: update salary immediately
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, salary: newSalary } : e));
    showToast('تم تحديث الراتب بنجاح');

    if (supabaseConfigured) {
      try {
        const updated = await updateEmployee(id, { salary: newSalary });
        setEmployees((prev) => prev.map((e) => e.id === id ? updated : e));
      } catch (err) {
        console.error('[Supabase] raiseEmployee failed:', err);
        showToast('تحذير: تحديث الراتب لم يُحفظ في قاعدة البيانات');
      }
    }
  }, [showToast]);

  const printReport = useCallback(() => { window.print(); }, []);

  return (
    <EmployeeContext.Provider value={{
      employees, loading, activeTab, setActiveTab,
      modal, openModal, closeModal,
      toast, showToast,
      printFilter, setPrintFilter, printEmployees,
      addEmployee, editEmployee, removeEmployee, raiseEmployee,
      printReport,
    }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used inside EmployeeProvider');
  return ctx;
}
