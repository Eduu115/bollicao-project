/**
 * ─── SEED ────────────────────────────────────────────────────────────────────
 * Pobla la base de datos con datos de prueba realistas.
 *
 * Uso (desde la carpeta server/):
 *   npx ts-node --project tsconfig.json db/seed.ts
 *
 * O con el script de npm (ver package.json):
 *   npm run seed
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import { Cliente } from '../models/Cliente';
import { Producto } from '../models/Producto';
import { Compra } from '../models/Compra';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bollicao';

// ─── Datos de prueba ──────────────────────────────────────────────────────────

const clientesData = [
    {
        nombre: 'Ana García',
        email: 'ana.garcia@email.com',
        passwordHash: '$2b$10$hashedpassword1',
        telefono: '612345678',
        direccion: 'Calle Mayor 12, Madrid',
    },
    {
        nombre: 'Carlos López',
        email: 'carlos.lopez@email.com',
        passwordHash: '$2b$10$hashedpassword2',
        telefono: '623456789',
        direccion: 'Avenida del Sol 5, Barcelona',
    },
    {
        nombre: 'María Fernández',
        email: 'maria.fernandez@email.com',
        passwordHash: '$2b$10$hashedpassword3',
        telefono: '634567890',
        direccion: 'Plaza España 3, Sevilla',
    },
    {
        nombre: 'Pedro Martínez',
        email: 'pedro.martinez@email.com',
        passwordHash: '$2b$10$hashedpassword4',
        telefono: '645678901',
        direccion: 'Calle Libertad 8, Valencia',
    },
];

const productosData = [
    {
        nombre: 'Tarta de Chocolate',
        descripcion: 'Tarta artesanal de chocolate negro con ganache y frutos rojos',
        precio: 28.50,
        categoria: 'tarta',
        imagen: 'https://example.com/tarta-chocolate.jpg',
        stock: 10,
        disponible: true,
    },
    {
        nombre: 'Tarta de Zanahoria',
        descripcion: 'Carrot cake con frosting de queso crema y nueces',
        precio: 24.00,
        categoria: 'tarta',
        imagen: 'https://example.com/tarta-zanahoria.jpg',
        stock: 8,
        disponible: true,
    },
    {
        nombre: 'Croissant de Mantequilla',
        descripcion: 'Croissant hojaldrado con mantequilla francesa, recién horneado',
        precio: 2.50,
        categoria: 'bollo',
        imagen: 'https://example.com/croissant.jpg',
        stock: 30,
        disponible: true,
    },
    {
        nombre: 'Bollo de Canela',
        descripcion: 'Bollo esponjoso con relleno de canela y glaseado de vainilla',
        precio: 3.00,
        categoria: 'bollo',
        imagen: 'https://example.com/bollo-canela.jpg',
        stock: 25,
        disponible: true,
    },
    {
        nombre: 'Pastel de Limón',
        descripcion: 'Pastel suave con crema de limón y merengue tostado',
        precio: 18.00,
        categoria: 'pastel',
        imagen: 'https://example.com/pastel-limon.jpg',
        stock: 6,
        disponible: true,
    },
    {
        nombre: 'Galletas de Avena y Chocolate',
        descripcion: 'Pack de 12 galletas artesanales con pepitas de chocolate',
        precio: 7.50,
        categoria: 'galleta',
        imagen: 'https://example.com/galletas-avena.jpg',
        stock: 20,
        disponible: true,
    },
    {
        nombre: 'Café con Leche',
        descripcion: 'Café de especialidad con leche entera vaporizada',
        precio: 2.00,
        categoria: 'bebida',
        imagen: 'https://example.com/cafe.jpg',
        stock: 100,
        disponible: true,
    },
    {
        nombre: 'Zumo de Naranja Natural',
        descripcion: 'Zumo exprimido al momento con naranjas de temporada',
        precio: 3.50,
        categoria: 'bebida',
        imagen: 'https://example.com/zumo.jpg',
        stock: 50,
        disponible: true,
    },
];

// ─── Función principal ────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Conectado a MongoDB: ${MONGO_URI}`);

        // 1. Limpiar colecciones existentes
        await Promise.all([
            Cliente.deleteMany({}),
            Producto.deleteMany({}),
            Compra.deleteMany({}),
        ]);
        console.log('Colecciones limpiadas');

        // 2. Insertar clientes
        const clientes = await Cliente.insertMany(clientesData);
        console.log(`${clientes.length} clientes insertados`);

        // 3. Insertar productos
        const productos = await Producto.insertMany(productosData);
        console.log(`${productos.length} productos insertados`);

        // 4. Insertar compras (usando los IDs reales de clientes y productos)
        const comprasData = [
            {
                cliente: clientes[0]._id,   // Ana
                lineas: [
                    {
                        producto: productos[0]._id,  // Tarta Chocolate
                        cantidad: 1,
                        precioUnitario: productos[0].precio,
                        subtotal: productos[0].precio * 1,
                    },
                    {
                        producto: productos[6]._id,  // Café
                        cantidad: 2,
                        precioUnitario: productos[6].precio,
                        subtotal: productos[6].precio * 2,
                    },
                ],
                total: productos[0].precio * 1 + productos[6].precio * 2,
                estado: 'entregado',
                descripcion: 'Pedido cumpleaños',
            },
            {
                cliente: clientes[1]._id,   // Carlos
                lineas: [
                    {
                        producto: productos[2]._id,  // Croissant
                        cantidad: 4,
                        precioUnitario: productos[2].precio,
                        subtotal: productos[2].precio * 4,
                    },
                    {
                        producto: productos[5]._id,  // Galletas
                        cantidad: 2,
                        precioUnitario: productos[5].precio,
                        subtotal: productos[5].precio * 2,
                    },
                ],
                total: productos[2].precio * 4 + productos[5].precio * 2,
                estado: 'confirmado',
            },
            {
                cliente: clientes[2]._id,   // María
                lineas: [
                    {
                        producto: productos[1]._id,  // Tarta Zanahoria
                        cantidad: 1,
                        precioUnitario: productos[1].precio,
                        subtotal: productos[1].precio * 1,
                    },
                    {
                        producto: productos[4]._id,  // Pastel Limón
                        cantidad: 1,
                        precioUnitario: productos[4].precio,
                        subtotal: productos[4].precio * 1,
                    },
                    {
                        producto: productos[7]._id,  // Zumo
                        cantidad: 3,
                        precioUnitario: productos[7].precio,
                        subtotal: productos[7].precio * 3,
                    },
                ],
                total: productos[1].precio + productos[4].precio + productos[7].precio * 3,
                estado: 'enviado',
                descripcion: 'Pedido para reunión de empresa',
            },
            {
                cliente: clientes[0]._id,   // Ana (segunda compra)
                lineas: [
                    {
                        producto: productos[3]._id,  // Bollo Canela
                        cantidad: 6,
                        precioUnitario: productos[3].precio,
                        subtotal: productos[3].precio * 6,
                    },
                ],
                total: productos[3].precio * 6,
                estado: 'pendiente',
            },
            {
                cliente: clientes[3]._id,   // Pedro
                lineas: [
                    {
                        producto: productos[0]._id,  // Tarta Chocolate
                        cantidad: 2,
                        precioUnitario: productos[0].precio,
                        subtotal: productos[0].precio * 2,
                    },
                    {
                        producto: productos[6]._id,  // Café
                        cantidad: 4,
                        precioUnitario: productos[6].precio,
                        subtotal: productos[6].precio * 4,
                    },
                ],
                total: productos[0].precio * 2 + productos[6].precio * 4,
                estado: 'confirmado',
                descripcion: 'Pedido para boda',
            },
        ];

        const compras = await Compra.insertMany(comprasData);
        console.log(`🛒 ${compras.length} compras insertadas`);

        // 5. Resumen
        console.log('\n Resumen del seed:');
        console.log(`   Clientes : ${clientes.length}`);
        console.log(`   Productos: ${productos.length}`);
        console.log(`   Compras  : ${compras.length}`);
        console.log('\n Seed completado con éxito');

    } catch (error) {
        console.error(' Error durante el seed:', error);
    } finally {
        await mongoose.disconnect();
        console.log(' Desconectado de MongoDB');
        process.exit(0);
    }
}

seed();
