import { NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/core/utils/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autenticado. Por favor ingresa a tu cuenta.' }, { status: 401 });
    }

    const decoded = verifyToken(sessionToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El pedido no tiene items' }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Producto ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
        }

        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });

        total += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      return tx.order.create({
        data: {
          userId: decoded.userId,
          status: 'PENDING_CONFIRMATION',
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar el pedido' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(sessionToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    if (decoded.role === 'ADMIN') {
      const orders = await prisma.order.findMany({
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(orders);
    } else {
      const orders = await prisma.order.findMany({
        where: { userId: decoded.userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
