import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { rating, comment, productId } = await req.json()
    if(session.user.email){
        const review = await prisma.review.create({
            data: {
              rating,
              comment,
              user: { connect: { email: session.user.email } },
              part: { connect: { id: productId } },
            },
            include: {
              user: true,
            },
          })
          return NextResponse.json(review)
    }
  } catch (error) {
    console.error('Error submitting review:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}