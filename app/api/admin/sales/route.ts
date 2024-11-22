import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user.role || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        total: true,
      },
    })

    const formattedData = salesData.map((item) => ({
      date: item.createdAt.toISOString().split('T')[0],
      amount: item._sum.total || 0,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.log(error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Failed to fetch sales data' }, { status: 500 })
  }
}