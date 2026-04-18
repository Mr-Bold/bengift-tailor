import { supabase } from '../../config/supabase.js'

class Worker {
  // Get all workers
  static async findAll(filters = {}) {
    let query = supabase.from('workers').select('*').order('created_at', { ascending: false })
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Get worker by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Create worker
  static async create(workerData) {
    const { data, error } = await supabase
      .from('workers')
      .insert([workerData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update worker
  static async update(id, workerData) {
    const { data, error } = await supabase
      .from('workers')
      .update(workerData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete worker
  static async delete(id) {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

export default Worker
