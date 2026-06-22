# COURT - Premium Basketball E-commerce

Una plataforma de comercio electrónico de básquetbol de alta gama, diseñada con una estética minimalista, moderna y de alto rendimiento inspirada en el estilo oficial de Nike.

## 🚀 Tecnologías y Arquitectura

* **Frontend & Backend**: Next.js (App Router) en TypeScript estricto.
* **Estilos**: Tailwind CSS v4 + Framer Motion para transiciones fluidas de imágenes y micro-interacciones.
* **Base de Datos & ORM**: Prisma ORM con SQLite para almacenamiento local ágil y autogestionado.
* **Estado Global**: React Context API para el manejo del carrito de compras y sesiones de usuario.

## 📦 Funcionalidades de la Plataforma

El sistema está dividido en dos flujos principales completamente integrados: el portal orientado al cliente (B2C) y el panel de administración (B2B Backoffice).

### 1. Interfaz del Cliente (B2C)
* **Catálogo de Productos**:
  * Visualización en grilla moderna con tarjetas de calzado e indumentaria.
  * Buscador integrado en tiempo real para filtrar productos por nombre o descripción.
  * Filtros de categorías dinámicos (Pills) para alternar entre *Zapatillas*, *Indumentaria* y *Accesorios*.
  * Ordenamiento de catálogo por precio (menor a mayor / mayor a menor).
* **Detalle del Producto**:
  * Ficha técnica de zapatillas con zoom interactivo al pasar el mouse por la imagen.
  * Selector de talles (US 8, 9, 10, 11, 12) con cambio de estado activo.
  * Indicadores de stock en tiempo real y alertas visuales de bajo inventario (menos de 5 unidades).
  * Notificación emergente (*Toast Popup*) animada en la esquina inferior al agregar un calzado con éxito.
* **Carrito de Compras Lateral (Cart Drawer)**:
  * Despliegue animado mediante deslizamiento lateral (*Framer Motion*).
  * Control de cantidades por producto (sumar, restar y eliminar directamente desde la barra).
  * Sumatoria automática del subtotal y del total general a abonar.
  * Persistencia en el navegador mediante `localStorage` para conservar el carrito en recargas de página.
* **Checkout y Pago Simulado**:
  * Formulario completo de datos de envío (dirección, ciudad y teléfono).
  * Verificación integrada de sesión: si el usuario no está logueado, se ofrece un formulario de inicio de sesión o registro rápido inline que no interrumpe el flujo de compra.
  * Simulación de pago seguro (estilo pasarela Mercado Pago) durante 2 segundos con indicador de carga y pantalla de éxito.
  * Procesamiento transaccional de stock: descuenta las unidades directamente de la base de datos de manera atómica.
* **Seguimiento de Pedido (Order Tracking)**:
  * Visualización del estado del pedido en tiempo real mediante un indicador de pasos horizontal con íconos de estado.
  * Estados del pedido: *Recibido* (pendiente de pago), *Confirmado*, *En Camino* (despachado) y *Entregado*.
  * Botón para refrescar el estado del pedido directamente desde la base de datos.

### 2. Panel de Administración (B2B Backoffice)
* **Control de Acceso**: Restricción de ruta a nivel de rol. Si el usuario logueado no posee privilegios de administrador, se muestra una pantalla limpia de "Acceso Denegado".
* **Gestión de Inventario (CRUD)**:
  * Formulario de alta para agregar nuevos productos con título, precio, stock, descripción, categoría y URL de la imagen.
  * Carga y edición de productos existentes (rellena automáticamente el formulario para modificar stock o precio).
  * Eliminación de productos de la base de datos con confirmación.
* **Gestión de Pedidos**:
  * Bandeja de entrada con todos los pedidos de la tienda.
  * Detalle de cada orden indicando los artículos comprados, comprador (nombre e email), montos individuales y fecha.
  * Botones de transición de estado para avanzar la orden en el ciclo de entrega:
    * *Confirmar Pago* (Avanza a `Confirmado`)
    * *Despachar* (Avanza a `En Camino`)
    * *Entregar* (Avanza a `Entregado`)

---

## 🗄️ Base de Datos local (SQLite)

Los datos de la plataforma se almacenan localmente en un archivo binario autogestionado por SQLite:
* **Ubicación del archivo**: `prisma/dev.db`
* **Visualización interactiva**: Para inspeccionar, buscar, editar y gestionar los productos, usuarios y pedidos de forma visual en tu navegador, ejecuta en la terminal:
  ```bash
  npx prisma studio
  ```
  Esto abrirá un panel de administración interactivo en `http://localhost:5555`.

---

## 🔑 Credenciales de Acceso (Pruebas)

Para probar los flujos de cliente y de administración, se pre-semillaron las siguientes cuentas en la base de datos:

### 1. Panel de Administración (Backoffice)
Permite gestionar el inventario (CRUD de productos) y procesar los pedidos de los compradores (cambiar estados).
* **Email**: `admin@gmail.com`
* **Contraseña**: `admin2026`
* *Nota: Al ingresar con este correo, se desbloqueará el botón "Panel Admin" en la barra de navegación superior.*

### 2. Cuenta de Cliente (B2C)
Cuenta de prueba para añadir calzado al carrito, simular pagos y seguir estados de envíos.
* **Email**: `user@gmail.com`
* **Contraseña**: `user123`
* *Nota: También es posible registrar cualquier cuenta nueva desde el formulario de registro.*

---

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Inicializar y sincronizar base de datos**:
   Genera el cliente Prisma y crea la base de datos local:
   ```bash
   npx prisma db push
   ```

3. **Cargar datos de prueba (Zapatillas de Élite)**:
   Semilla la base de datos con los últimos modelos de calzado (Ja Morant, Giannis, Kobe, LeBron, etc.) y los usuarios de prueba:
   ```bash
   npx tsx prisma/seed.ts
   ```

4. **Correr servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la tienda.

5. **Construir para producción (opcional)**:
   ```bash
   npm run build
   ```
