// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed CarMakers

  /* await prisma.carMaker.createMany({
    data: [
      { name: 'Toyota', logo: '/toyota-logo.svg' },
      { name: 'Honda', logo: '/honda-logo.svg' },
      { name: 'Ford', logo: '/ford-logo.svg' },
      { name: 'Chevrolet', logo: '/chevrolet-logo.svg' },
      { name: 'Nissan', logo: '/nissan-logo.svg' },
      { name: 'BMW', logo: '/bmw-logo.svg' },
      { name: 'Mitsubishi', logo: '/mitsubishi-logo.svg' },
      { name: 'Lexus', logo: '/lexus-logo.svg' },
    ],
  }); */

  const carMakers = [
    { name: 'Audi', logo: '/carmakers/audi-logo.svg' },
    { name: 'BMW', logo: '/carmakers/bmw-logo.svg' },
    { name: 'Chevrolet', logo: '/carmakers/chevrolet-logo.svg' },
    { name: 'Fiat', logo: '/carmakers/fiat-logo.svg' },
    { name: 'Ford', logo: '/carmakers/ford-logo.svg' },
    { name: 'Honda', logo: '/carmakers/honda-logo.svg' },
    { name: 'Hyundai', logo: '/carmakers/hyundai-logo.svg' },
    { name: 'Isuzu', logo: '/carmakers/isuzu-logo.svg' },
    { name: 'Jaguar', logo: '/carmakers/jaguar-logo.svg' },
    { name: 'Jeep', logo: '/carmakers/jeep-logo.svg' },
    { name: 'Kia', logo: '/carmakers/kia-logo.svg' },
    { name: 'Land Rover', logo: '/carmakers/land-rover-logo.svg' },
    { name: 'Lexus', logo: '/carmakers/lexus-logo.svg' },
    { name: 'Mahindra', logo: '/carmakers/mahindra-logo.svg' },
    { name: 'Mitsubishi', logo: '/carmakers/mitsubishi-logo.svg' },
    { name: 'Nissan', logo: '/carmakers/nissan-logo.svg' },
    { name: 'Renault', logo: '/carmakers/renault-logo.svg' },
    { name: 'Skoda', logo: '/carmakers/skoda-logo.svg' },
    { name: 'Tata', logo: '/carmakers/tata-logo.svg' },
    { name: 'Volkswagen', logo: '/carmakers/volkswagen-logo.svg' },
    { name: 'Volvo', logo: '/carmakers/volvo-logo.svg' },
  ];
  
  for (const maker of carMakers) {
    const existingMaker = await prisma.carMaker.findUnique({
      where: { name: maker.name },
    });
  
    if (!existingMaker) {
      await prisma.carMaker.create({ data: maker });
      console.log(`Added new car maker: ${maker.name}`);
    } else {
      console.log(`Car maker ${maker.name} already exists. Skipping.`);
    }
  }

  const toyota = await prisma.carMaker.upsert({
    where: { name: 'Toyota' },
    update: {logo: '/carmakers/toyota-logo.svg'},
    create: { name: 'Toyota', logo: '/carmakers/toyota-logo.svg' },
  });

  const honda = await prisma.carMaker.upsert({
    where: { name: 'Honda' },
    update: {logo: '/carmakers/honda-logo.svg'},
    create: { name: 'Honda', logo: '/carmakers/honda-logo.svg' },
  });

  // Seed ModelLines
  const camry = await prisma.modelLine.upsert({
    where: { name_carMakerId: { name: 'Camry', carMakerId: toyota.id } },
    update: {},
    create: { name: 'Camry', carMakerId: toyota.id },
  });

  const civic = await prisma.modelLine.upsert({
    where: { name_carMakerId: { name: 'Civic', carMakerId: honda.id } },
    update: {},
    create: { name: 'Civic', carMakerId: honda.id },
  });

  // Seed Years
  const camry2022 = await prisma.year.upsert({
    where: { year_modelLineId: { year: 2022, modelLineId: camry.id } },
    update: {},
    create: { year: 2022, modelLineId: camry.id },
  });

  const camry2023 = await prisma.year.upsert({
    where: { year_modelLineId: { year: 2023, modelLineId: camry.id } },
    update: {},
    create: { year: 2023, modelLineId: camry.id },
  });

  const civic2022 = await prisma.year.upsert({
    where: { year_modelLineId: { year: 2022, modelLineId: civic.id } },
    update: {},
    create: { year: 2022, modelLineId: civic.id },
  });

  // Seed Modifications
  const camryLE = await prisma.modification.upsert({
    where: { name_yearId: { name: 'LE', yearId: camry2022.id } },
    update: {},
    create: { name: 'LE', yearId: camry2022.id },
  });

  const camryXLE = await prisma.modification.upsert({
    where: { name_yearId: { name: 'XLE', yearId: camry2023.id } },
    update: {},
    create: { name: 'XLE', yearId: camry2023.id },
  });

  const civicEX = await prisma.modification.upsert({
    where: { name_yearId: { name: 'EX', yearId: civic2022.id } },
    update: {},
    create: { name: 'EX', yearId: civic2022.id },
  });

  // Seed Categories
  const brakes = await prisma.category.upsert({
    where: { name: 'Brakes' },
    update: {},
    create: { name: 'Brakes', image: '/categories/brakes.svg' },
  });

  const service_parts = await prisma.category.upsert({
    where: { name: 'Service Parts' },
    update: {},
    create: { name: 'Service Parts', image: '/categories/service-parts.svg' },
  });

  const filters = await prisma.category.upsert({
    where: { name: 'Filters' },
    update: {},
    create: { name: 'Filters', image: '/categories/filters.svg' },
  });

  // Seed Parts
  await prisma.part.upsert({
    where: {  name: 'Premium Brake Pads' },
    update: {},
    create: {
      name: 'Premium Brake Pads',
      description: 'High-performance brake pads for optimal stopping power.',
      price: 79.99,
      image: '/placeholder.svg',
      stockQuantity: 0,
      categoryId: brakes.id,
      modelLineId: camry.id,
      modifications: { connect: [{ id: camryLE.id }] },
    },
  });

  await prisma.part.upsert({
    where: {  name: 'Oil Filter' },
    update: {},
    create: {
      name: 'Oil Filter',
      description: 'High-quality oil filter for improved engine protection.',
      price: 12.99,
      image: '/placeholder.svg',
      categoryId: filters.id,
      modelLineId: civic.id,
      modifications: { connect: [{ id: civicEX.id }] },
    },
  });

  // Seed Users
  await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password', // In a real app, make sure to hash the password
      role: 'USER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password', // In a real app, make sure to hash the password
      role: 'ADMIN',
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
