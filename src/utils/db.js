import { supabase } from '../supabase'
import { initAllData } from './calc'

export async function loadUserData(userId) {
  const { data, error } = await supabase
    .from('financial_data')
    .select('data')
    .eq('user_id', userId)
    .eq('year', 2026)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Load error:', error)
    return initAllData()
  }
  return data?.data || initAllData()
}

export async function saveUserData(userId, payload) {
  const { error } = await supabase
    .from('financial_data')
    .upsert({ user_id: userId, year: 2026, data: payload, updated_at: new Date().toISOString() },
             { onConflict: 'user_id,year' })
  if (error) console.error('Save error:', error)
  return !error
}
