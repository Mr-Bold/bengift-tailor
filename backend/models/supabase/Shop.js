import { supabase } from '../../config/supabase.js'

class Shop {
  // Get shop settings (usually only one shop)
  static async get() {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create shop
  static async create(shopData) {
    const { data, error } = await supabase
      .from('shops')
      .insert([shopData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update shop
  static async update(id, shopData) {
    const { data, error } = await supabase
      .from('shops')
      .update(shopData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export default Shop
