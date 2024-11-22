import prisma from '@/lib/prisma'

export async function getProducts() {
  return await prisma.part.findMany({
    include: {
      category: true,
      modelLine: {
        include: {
          carMaker: true,
        },
      },
    },
  })
}

export async function getProductById(id: string) {
  return await prisma.part.findUnique({
    where: { id },
    include: {
      category: true,
      modelLine: {
        include: {
          carMaker: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
    },
  })
}

export async function searchProducts(query: string) {
  return await prisma.part.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { category: true },
  })
}