import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Error fetching category' }, { status: 500 })
  }
}