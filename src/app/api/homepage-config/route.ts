import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/core/utils/auth';

const configPath = path.join(process.cwd(), 'src', 'data', 'homepageConfig.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Configuration file not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
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

    const payload = await request.json();

    // Basic structure validation
    if (!payload.heroTitle || !payload.heroSubtitle || !payload.heroImage || !payload.athletes || payload.athletes.length !== 4) {
      return NextResponse.json({ error: 'Datos de configuración incompletos o inválidos.' }, { status: 400 });
    }

    // Ensure src/data directory exists
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    
    // Write JSON file
    await fs.writeFile(configPath, JSON.stringify(payload, null, 2), 'utf-8');

    return NextResponse.json({ success: true, config: payload });
  } catch (error: any) {
    console.error('Error updating homepage configuration:', error);
    return NextResponse.json({ error: error.message || 'Error en el servidor' }, { status: 500 });
  }
}
