import { createClient } from '@supabase/supabase-js';
import type { Employee } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function insertEmployee(
  emp: Omit<Employee, 'id' | 'created_at' | 'updated_at'>
): Promise<Employee> {
  const { data, error } = await supabase
    .from('employees')
    .insert(emp)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEmployee(
  id: number,
  updates: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>
): Promise<Employee> {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEmployee(id: number): Promise<void> {
  const { error } = await supabase.from('employees').delete().eq('id', id);
  if (error) throw error;
}
