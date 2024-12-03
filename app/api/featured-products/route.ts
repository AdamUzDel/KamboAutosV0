// app/api/featured-products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const featuredProducts = await prisma.part.findMany({
      take: 8,
      include: { category: true },
    });
    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({ error: 'Error fetching featured products' }, { status: 500 });
  }
}
