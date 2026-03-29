import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Charts.css'

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

export function RevenueChart({ jobs }) {
  // Group jobs by month
  const monthlyData = jobs
    .filter(j => j.status === 'Delivered')
    .reduce((acc, job) => {
      const month = new Date(job.deliveryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!acc[month]) acc[month] = 0
      acc[month] += job.totalAmount
      return acc
    }, {})

  const data = Object.entries(monthlyData).map(([month, revenue]) => ({
    month,
    revenue
  }))

  return (
    <div className="chart-container">
      <h3>Monthly Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₵${value.toFixed(2)}`} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function OrderStatusChart({ jobs }) {
  const statusData = jobs.reduce((acc, job) => {
    const status = job.status
    if (!acc[status]) acc[status] = 0
    acc[status]++
    return acc
  }, {})

  const data = Object.entries(statusData).map(([name, value]) => ({
    name,
    value
  }))

  return (
    <div className="chart-container">
      <h3>Orders by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function WorkerPerformanceChart({ jobs, workers }) {
  const workerData = workers.map(worker => {
    const workerJobs = jobs.filter(j => j.workerId === (worker.id || worker._id))
    const completed = workerJobs.filter(j => j.status === 'Delivered').length
    const pending = workerJobs.filter(j => j.status !== 'Delivered').length
    
    return {
      name: worker.name.split(' ')[0], // First name only
      completed,
      pending,
      total: workerJobs.length
    }
  })

  return (
    <div className="chart-container">
      <h3>Worker Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={workerData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#10b981" name="Completed" />
          <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
