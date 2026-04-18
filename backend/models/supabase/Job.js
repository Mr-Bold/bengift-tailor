import { supabase } from '../../config/supabase.js'

class Job {
  // Get all jobs with filters
  static async findAll(filters = {}) {
    let query = supabase.from('jobs').select('*').order('order_date', { ascending: false })
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }
    
    if (filters.search) {
      query = query.or(`job_no.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`)
    }
    
    if (filters.startDate && filters.endDate) {
      query = query.gte('order_date', filters.startDate).lte('order_date', filters.endDate)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Get job by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Get job by job number
  static async findByJobNo(jobNo) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_no', jobNo)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create job
  static async create(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update job
  static async update(id, jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete job
  static async delete(id) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }

  // Get jobs by status
  static async findByStatus(status) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', status)
      .order('delivery_date', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Get upcoming deliveries
  static async getUpcomingDeliveries(days = 7) {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)
    
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .gte('delivery_date', today.toISOString())
      .lte('delivery_date', futureDate.toISOString())
      .neq('status', 'Delivered')
      .order('delivery_date', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Get dashboard stats
  static async getStats() {
    const { data: allJobs, error } = await supabase
      .from('jobs')
      .select('status, total_amount, advance_paid, balance')
    
    if (error) throw error
    
    const stats = {
      total: allJobs.length,
      pending: allJobs.filter(j => j.status === 'Pending').length,
      inProgress: allJobs.filter(j => j.status === 'In Progress').length,
      ready: allJobs.filter(j => j.status === 'Ready').length,
      delivered: allJobs.filter(j => j.status === 'Delivered').length,
      totalRevenue: allJobs.reduce((sum, j) => sum + parseFloat(j.total_amount || 0), 0),
      totalAdvance: allJobs.reduce((sum, j) => sum + parseFloat(j.advance_paid || 0), 0),
      totalBalance: allJobs.reduce((sum, j) => sum + parseFloat(j.balance || 0), 0)
    }
    
    return stats
  }
}

export default Job
