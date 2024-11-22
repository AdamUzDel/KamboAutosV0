import prisma from '@/lib/prisma'

export async function getDashboardData() {
  const productCount = await prisma.part.count()
  const orderCount = await prisma.order.count()
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  })
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })

  return {
    productCount,
    orderCount,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
  }
}