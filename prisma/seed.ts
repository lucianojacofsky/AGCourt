import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleared.');

  // Create Users
  const adminPassword = await bcrypt.hash('admin2026', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      name: 'Admin Court',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      name: 'Lucia Jordan',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('Users created:', { admin: admin.email, customer: customer.email });

  // Create Products
  const products = [
    {
      name: 'Nike Ja 1 "Day One"',
      description: 'El primer modelo de firma para Ja Morant. Diseñado con una amortiguación ultra reactiva Zoom Air en el antepié y un sistema de sujeción lateral optimizado para despegues rápidos y cambios de dirección explosivos.',
      price: 139.99,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800',
      category: 'Zapatillas',
    },
    {
      name: 'Nike Zoom Freak 5 "Keep It Fresh"',
      description: 'El calzado oficial de Giannis Antetokounmpo. Cuenta con una entresuela de espuma de doble densidad y ranuras multidireccionales en la suela para tracción total en transiciones rápidas.',
      price: 149.99,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800',
      category: 'Zapatillas',
    },
    {
      name: 'Nike Kobe 8 Protro "Halo"',
      description: 'Una reedición del icónico calzado de Kobe Bryant. Liviano, minimalista y de corte bajo, con amortiguación reactiva Nike React Drop-in que ofrece una conexión absoluta con la cancha.',
      price: 179.99,
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800',
      category: 'Zapatillas',
    },
    {
      name: 'Nike LeBron XXI "Tahitian"',
      description: 'Diseñadas para la dominancia moderna de LeBron James. Su estructura de perfil bajo cuenta con amortiguación Zoom Air en el talón y antepié combinada con una placa de fibra de carbono para máxima propulsión.',
      price: 199.99,
      stock: 6,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800',
      category: 'Zapatillas',
    },
    {
      name: 'Nike KD 16 "Aura"',
      description: 'El modelo exclusivo de Kevin Durant. Posee una amortiguación Zoom Air combinada con espuma responsive para transiciones suaves desde el talón hasta la punta del pie. Soporte dinámico para tiradores de media y larga distancia.',
      price: 159.99,
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800',
      category: 'Zapatillas',
    },
    {
      name: 'Air Jordan XXXVIII "FIBA"',
      description: 'Inspirado en la herencia de Michael Jordan. Confeccionado con materiales premium que reducen el peso del calzado y suela dividida en secciones para giros rápidos sin pérdida de estabilidad.',
      price: 189.99,
      stock: 7,
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800',
      category: 'Zapatillas',
    },
    {
      name: 'Camiseta Brooklyn Nets - Durant',
      description: 'Camiseta oficial de corte clásico con tecnología Dri-FIT para mantenerte fresco en los momentos más intensos del partido.',
      price: 89.99,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800',
      category: 'Indumentaria',
    },
    {
      name: 'Pelota NBA Official Game Ball',
      description: 'Pelota reglamentaria construida con cuero genuino para ofrecer un agarre profesional óptimo en canchas cubiertas.',
      price: 120.00,
      stock: 14,
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800',
      category: 'Accesorios',
    },
    {
      name: 'Medias Nike Elite Crew',
      description: 'Zonas de amortiguación reforzadas y soporte en el arco del pie para reducir el impacto y evitar deslizamientos del pie dentro del calzado.',
      price: 18.00,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=800',
      category: 'Accesorios',
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Seed products populated successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
