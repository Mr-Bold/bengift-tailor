import { supabase } from '../../config/supabase.js'

class Fabric {
  // Get all fabrics
  static async findAll(filters = {}) {
    let query = supabase.from('fabrics').select('*').order('created_at', { ascending: false })
    
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Get fabric by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('fabrics')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Create fabric
  static async create(fabricData) {
    const { data, error } = await supabase
      .from('fabrics')
      .insert([fabricData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update fabric
  static async update(id, fabricData) {
    const { data, error } = await supabase
      .from('fabrics')
      .update(fabricData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete fabric
  static async delete(id) {
    const { error } = await supabase
      .from('fabrics')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

export default Fabric
