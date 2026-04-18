import { supabase } from '../../config/supabase.js'

class Customer {
  // Get all customers
  static async findAll(filters = {}) {
    let query = supabase.from('customers').select('*').order('created_at', { ascending: false })
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Get customer by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Get customer by phone
  static async findByPhone(phone) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create customer
  static async create(customerData) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update customer
  static async update(id, customerData) {
    const { data, error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete customer
  static async delete(id) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }

  // Update customer stats
  static async updateStats(id, totalOrders, totalSpent) {
    return await this.update(id, {
      total_orders: totalOrders,
      total_spent: totalSpent
    })
  }
}

export default Customer
