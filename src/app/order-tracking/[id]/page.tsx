import { notFound } from 'next/navigation';
import { prisma } from '@/core/db/prisma';
import OrderTrackingClient from './OrderTrackingClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const serializedOrder = {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    user: {
      id: order.user.id,
      email: order.user.email,
      name: order.user.name,
      role: order.user.role,
      createdAt: order.user.createdAt.toISOString(),
    },
    items: order.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
      },
    })),
  };

  return <OrderTrackingClient order={serializedOrder as any} />;
}
