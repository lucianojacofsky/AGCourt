import { NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/core/utils/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado. Debes iniciar sesión.' }, { status: 401 });
    }

    const decoded = verifyToken(sessionToken);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado. Se requiere rol de Administrador.' }, { status: 403 });
    }

    // Retrieve all users excluding their password hash
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to include orderCount
    const mappedUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
      orderCount: u.orders.length,
    }));

    return NextResponse.json(mappedUsers);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message || 'Error en el servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado. Debes iniciar sesión.' }, { status: 401 });
    }

    const decoded = verifyToken(sessionToken);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado. Se requiere rol de Administrador.' }, { status: 403 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ error: 'Faltan parámetros obligatorios (userId, role).' }, { status: 400 });
    }

    if (role !== 'USER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Rol inválido. Debe ser USER o ADMIN.' }, { status: 400 });
    }

    // Prevent administrators from removing their own admin role to avoid lockouts
    if (userId === decoded.userId && role !== 'ADMIN') {
      return NextResponse.json({ error: 'No puedes revocar tus propios permisos de administrador.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: error.message || 'Error al actualizar el rol de usuario' }, { status: 500 });
  }
}
