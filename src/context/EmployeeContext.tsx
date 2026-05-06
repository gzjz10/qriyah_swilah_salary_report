'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Employee, ModalState, Tab } from '@/types';
import {
  fetchEmployees,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/lib/supabase';
import { SEED_EMPLOYEES } from '@/lib/seed-data';

const supabaseConfigured =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

interface Toast {
  message: string;
  visible: boolean;
}

interface EmployeeContextValue {
  employees: Employee[];
  loading: boolean;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  modal: ModalState;
  openModal: (state: ModalState) => void;
  closeModal: () => void;
  toast: Toast;
  showToast: (msg: string) => void;
  addEmployee: (emp: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editEmployee: (id: number, updates: Partial<Employee>) => Promise<void>;
  removeEmployee: (id: number) => Promise<void>;
  raiseEmployee: (id: number, newSalary: number) => Promise<void>;
  printReport: () => void;
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('salaries');
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<Toast>({ message: '', visible: false });

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

  useEffect(() => {
    load();
  }, [load]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  }, []);

  const openModal = useCallback((state: ModalState) => setModal(state), []);
  const closeModal = useCallback(() => setModal(null), []);

  const addEmployee = useCallback(
    async (emp: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      if (!supabaseConfigured) {
        const newEmp: Employee = { ...emp, id: Date.now() };
        setEmployees((prev) => [...prev, newEmp]);
        showToast('تم إضافة الموظف بنجاح');
        return;
      }
      const created = await insertEmployee(emp);
      setEmployees((prev) => [...prev, created]);
      showToast('تم إضافة الموظف بنجاح');
    },
    [showToast]
  );

  const editEmployee = useCallback(
    async (id: number, updates: Partial<Employee>) => {
      if (!supabaseConfigured) {
        setEmployees((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
        showToast('تم تحديث بيانات الموظف');
        return;
      }
      const updated = await updateEmployee(id, updates);
      setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
      showToast('تم تحديث بيانات الموظف');
    },
    [showToast]
  );

  const removeEmployee = useCallback(
    async (id: number) => {
      if (!supabaseConfigured) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        showToast('تم حذف الموظف');
        return;
      }
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      showToast('تم حذف الموظف');
    },
    [showToast]
  );

  const raiseEmployee = useCallback(
    async (id: number, newSalary: number) => {
      if (!supabaseConfigured) {
        setEmployees((prev) =>
          prev.map((e) => (e.id === id ? { ...e, salary: newSalary } : e))
        );
        showToast('تم تحديث الراتب بنجاح');
        return;
      }
      const updated = await updateEmployee(id, { salary: newSalary });
      setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
      showToast('تم تحديث الراتب بنجاح');
    },
    [showToast]
  );

  const printReport = useCallback(() => {
    window.print();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        activeTab,
        setActiveTab,
        modal,
        openModal,
        closeModal,
        toast,
        showToast,
        addEmployee,
        editEmployee,
        removeEmployee,
        raiseEmployee,
        printReport,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used inside EmployeeProvider');
  return ctx;
}
