# COURT - Premium Basketball E-commerce

Una plataforma de comercio electrónico de básquetbol de alta gama, diseñada con una estética minimalista, moderna y de alto rendimiento inspirada en el estilo oficial de Nike.

## 🚀 Tecnologías y Arquitectura

* **Frontend & Backend**: Next.js 16 (App Router) en TypeScript estricto.
* **Estilos**: Tailwind CSS + Framer Motion para transiciones fluidas de imágenes y micro-interacciones.
* **Base de Datos & ORM**: Prisma ORM con PostgreSQL para almacenamiento robusto en base de datos.
* **Estado Global**: React Context API para el manejo del carrito de compras y sesiones de usuario.
* **Configuración Dinámica**: Almacenamiento local mediante JSON (`src/data/homepageConfig.json`) expuesto mediante un API REST seguro para personalización de portada en vivo.

## 📦 Funcionalidades de la Plataforma

El sistema está dividido en dos flujos principales completamente integrados: el portal orientado al cliente (B2C) y el panel de administración (B2B Backoffice).

### 1. Interfaz del Cliente (B2C)
* **Cabecera Expandida (Header)**:
  * Menú de navegación en el centro con enlaces a **Novedades**, **Atletas** y **Catálogo** que se desplazan de forma suave (`scroll-behavior: smooth`).
  * Controles de inicio de sesión, panel de administración (para cuentas autorizadas) y carrito de compras a la derecha.
* **Navegación Secundaria (SubHeader)**:
  * Barra negra premium al estilo Nike Basketball que permite filtrar el catálogo por categorías primarias: *Calzado*, *Ropa*, *Equipamiento* y *Ofertas*.
* **Página Principal Inmersiva**:
  * **Hero Banner**: Widescreen completo con tipografía masiva itálica ("SIEMPRE EN VUELO.") y botones tipo píldora configurables.
  * **Sección "Comprar por Atleta"**: Grilla de deportistas (Kobe Bryant, Ja Morant, Giannis, LeBron) que filtra dinámicamente el catálogo inferior con un click.
  * **Carrusel "Lanzamientos de Élite"**: Slider horizontal de zapatillas sobre tarjetas grises suaves sin bordes ni sombras.
  * **Catálogo de Dos Columnas**: Filtros a la izquierda (búsqueda, categorías y orden por precio) y grilla minimalista a la derecha.
* **Detalle del Producto**:
  * Ficha técnica con zoom interactivo al pasar el mouse por la imagen, selector de talles (US 8 al 12) y avisos de stock crítico.
* **Carrito Lateral (Cart Drawer)**:
  * Despliegue con Framer Motion, control de cantidades y totalizador automático persistido en `localStorage`.
* **Checkout y Seguimiento (Order Tracking)**:
  * Simulación de pago de 2 segundos, descuento atómico de stock en base de datos y trazador horizontal de estados del pedido en tiempo real.

### 2. Panel de Administración Premium (B2B Backoffice)
El panel cuenta ahora con cinco pestañas de control absoluto para el administrador:

* **Dashboard (Panel de Control)**:
  * **KPIs en Vivo**: Ventas totales acumuladas, volumen total de pedidos, producto estrella más vendido y cantidad de productos en stock crítico.
  * **Desglose de Logística**: Métricas por estado de entrega (Pendientes, Confirmados, Despachados, Entregados).
  * **Alertas de Inventario**: Listado directo de zapatillas con stock crítico ($\le$ 5) para reabastecimiento rápido.
* **Inventario**:
  * Formulario completo para Añadir/Editar productos y lista de productos con acciones de edición y eliminación.
* **Pedidos**:
  * Gestión de logística de entrega. Permite cambiar el estado de las órdenes en su ciclo de vida (*Confirmar Pago* $\rightarrow$ *Despachar* $\rightarrow$ *Entregar*).
* **Usuarios**:
  * Listado completo de usuarios registrados indicando su nombre, email, fecha de registro y cantidad de pedidos.
  * Botón para ascender o revocar privilegios de **Administrador** en tiempo real.
* **Personalizar (Homepage Live Customizer)**:
  * Formulario interactivo para cambiar los textos, imágenes y botones de la sección principal (Hero) y configurar los nombres, imágenes, lemas y búsquedas de la grilla de Atletas en vivo.

---

## 🗄️ Base de Datos y APIs

* **Esquema de Datos**: Tablas estructuradas para `User`, `Product`, `Order` y `OrderItem` manejadas mediante Prisma Client.
* **Endpoints de API**:
  * `/api/products` - CRUD de inventario.
  * `/api/orders` - Creación y gestión de pedidos.
  * `/api/users` - Consulta de lista de usuarios y actualización de roles (Seguridad ADMIN).
  * `/api/homepage-config` - Carga y edición de la configuración de la portada en JSON (Seguridad ADMIN).

---

## 🔑 Credenciales de Acceso (Pruebas)

### 1. Administrador (Panel de Control)
* **Email**: `admin@gmail.com`
* **Contraseña**: `admin2026`

### 2. Cliente de Prueba
* **Email**: `user@gmail.com`
* **Contraseña**: `user123`

---

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Sincronizar base de datos**:
   ```bash
   npx prisma db push
   ```

3. **Cargar datos de semilla (Zapatillas y Usuarios)**:
   ```bash
   npx tsx prisma/seed.ts
   ```

4. **Correr servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Compilar para producción**:
   ```bash
   npm run build
   ```
