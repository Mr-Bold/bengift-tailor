import { z } from 'zod'

export const jobSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  trialDate: z.string().optional(),
  assignedWorker: z.string().optional(),
  receiptAccount: z.string().default('Cash'),
  amountReceived: z.number().min(0, 'Amount must be positive').default(0),
  delivered: z.boolean().default(false),
  cancelJobCard: z.boolean().default(false),
  cancelReason: z.string().optional(),
})

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  address: z.string().optional(),
})

export const workerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  address: z.string().optional(),
  salary: z.number().min(0, 'Salary must be positive').default(0),
  status: z.enum(['Active', 'Inactive']).default('Active'),
})

export const fabricSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  fees: z.number().min(0, 'Fees must be positive').default(0),
  workerFees: z.number().min(0, 'Worker fees must be positive').default(0),
  productionCapacity: z.number().min(0, 'Capacity must be positive').default(0),
})
