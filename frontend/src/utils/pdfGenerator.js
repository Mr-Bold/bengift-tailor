import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function generateJobCardPDF(job, shopInfo) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(139, 0, 0) // Wine color
  doc.text(shopInfo.name || 'BenGift Clothing', 105, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text('Inspiring Confidence', 105, 27, { align: 'center' })
  
  if (shopInfo.phone) {
    doc.text(`Phone: ${shopInfo.phone}`, 105, 33, { align: 'center' })
  }
  
  // Job Details
  doc.setFontSize(16)
  doc.text('Job Card', 105, 45, { align: 'center' })
  
  doc.setFontSize(11)
  const startY = 55
  
  doc.text(`Job ID: ${job.jobNo}`, 20, startY)
  doc.text(`Date: ${job.orderDate}`, 150, startY)
  
  doc.text(`Customer: ${job.customerName}`, 20, startY + 7)
  doc.text(`Delivery Date: ${job.deliveryDate}`, 20, startY + 14)
  
  if (job.trialDate) {
    doc.text(`Trial Date: ${job.trialDate}`, 20, startY + 21)
  }
  
  // Items Table
  const tableData = job.items.map(item => [
    item.item,
    item.qty,
    `₵${item.fees.toFixed(2)}`,
    `${item.discount || 0}%`,
    `₵${item.finalFees.toFixed(2)}`,
    `₵${item.amount.toFixed(2)}`
  ])
  
  doc.autoTable({
    startY: startY + 28,
    head: [['Item', 'Qty', 'Fees', 'Discount', 'Final Fees', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [139, 0, 0] },
  })
  
  // Payment Summary
  const finalY = doc.lastAutoTable.finalY + 10
  doc.text(`Total Amount: ₵${job.totalAmount.toFixed(2)}`, 20, finalY)
  doc.text(`Advance Paid: ₵${job.advancePaid.toFixed(2)}`, 20, finalY + 7)
  doc.setFont(undefined, 'bold')
  doc.text(`Balance Due: ₵${job.balance.toFixed(2)}`, 20, finalY + 14)
  
  // Footer
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)
  doc.text('Thank you for your business!', 105, 280, { align: 'center' })
  
  return doc
}

export function generateInvoicePDF(job, shopInfo) {
  const doc = generateJobCardPDF(job, shopInfo)
  
  // Add "INVOICE" watermark
  doc.setFontSize(60)
  doc.setTextColor(200, 200, 200)
  doc.text('INVOICE', 105, 150, { align: 'center', angle: 45 })
  
  return doc
}

export function generateReportPDF(jobs, filters, shopInfo) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(18)
  doc.text(`${shopInfo.name || 'BenGift Clothing'} - Report`, 105, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 27, { align: 'center' })
  
  // Summary
  const totalRevenue = jobs.filter(j => j.status === 'Delivered').reduce((sum, j) => sum + j.totalAmount, 0)
  const pendingAmount = jobs.filter(j => j.status !== 'Delivered').reduce((sum, j) => sum + j.balance, 0)
  
  doc.text(`Total Jobs: ${jobs.length}`, 20, 40)
  doc.text(`Total Revenue: ₵${totalRevenue.toFixed(2)}`, 20, 47)
  doc.text(`Pending Amount: ₵${pendingAmount.toFixed(2)}`, 20, 54)
  
  // Jobs Table
  const tableData = jobs.map(job => [
    job.jobNo,
    job.customerName,
    job.orderDate,
    job.deliveryDate,
    job.status,
    `₵${job.totalAmount.toFixed(2)}`,
    `₵${job.balance.toFixed(2)}`
  ])
  
  doc.autoTable({
    startY: 65,
    head: [['Job ID', 'Customer', 'Order Date', 'Delivery', 'Status', 'Total', 'Balance']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [139, 0, 0] },
    styles: { fontSize: 8 },
  })
  
  return doc
}
