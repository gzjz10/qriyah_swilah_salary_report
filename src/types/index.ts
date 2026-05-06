export interface Employee {
  id: number;
  name: string;
  title: string;
  dept: string;
  branch: string;
  salary: number;
  created_at?: string;
  updated_at?: string;
}

export type Tab = 'salaries' | 'cards' | 'depts' | 'analytics' | 'reports';

export type ModalState =
  | { type: 'add' }
  | { type: 'edit'; employee: Employee }
  | { type: 'delete'; employee: Employee }
  | { type: 'raise'; employee: Employee }
  | { type: 'dept'; dept: string }
  | null;
