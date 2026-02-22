/**
 * ─── SEED ────────────────────────────────────────────────────────────────────
 * Uso:  npx ts-node --project tsconfig.json db/seed.ts
 *   o:  npm run seed
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import { Cliente } from '../models/Cliente';
import { Producto } from '../models/Producto';
import { Compra } from '../models/Compra';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bollicao';

// ─── Clientes ─────────────────────────────────────────────────────────────────

const clientesData = [
    { nombre: 'Ana García', email: 'ana.garcia@email.com', passwordHash: 'pass1234', telefono: '612345678', direccion: 'Calle Mayor 12, Madrid' },
    { nombre: 'Carlos López', email: 'carlos.lopez@email.com', passwordHash: 'pass1234', telefono: '623456789', direccion: 'Avenida del Sol 5, Barcelona' },
    { nombre: 'María Fernández', email: 'maria.fernandez@email.com', passwordHash: 'pass1234', telefono: '634567890', direccion: 'Plaza España 3, Sevilla' },
    { nombre: 'Pedro Martínez', email: 'pedro.martinez@email.com', passwordHash: 'pass1234', telefono: '645678901', direccion: 'Calle Libertad 8, Valencia' },
];

// ─── Productos ────────────────────────────────────────────────────────────────
// Fotos: Unsplash (libres de uso)

const productosData = [
    // ── TARTAS ──
    {
        nombre: 'Tarta de Chocolate',
        descripcion: 'Tarta artesanal de chocolate negro con ganache y frutos rojos',
        precio: 28.50, categoria: 'tarta', stock: 10, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Tarta de Zanahoria',
        descripcion: 'Carrot cake con frosting de queso crema y nueces',
        precio: 24.00, categoria: 'tarta', stock: 8, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Tarta de Fresas',
        descripcion: 'Base de bizcocho esponjoso, crema pastelera y fresas frescas de temporada',
        precio: 26.00, categoria: 'tarta', stock: 6, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Tarta de Queso',
        descripcion: 'Cheesecake al horno con base de galleta y coulis de frambuesa',
        precio: 22.50, categoria: 'tarta', stock: 7, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Tarta Red Velvet',
        descripcion: 'Layers de bizcocho rojo terciopelo con frosting de queso crema',
        precio: 30.00, categoria: 'tarta', stock: 5, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop',
    },
    // ── BOLLOS ──
    {
        nombre: 'Croissant de Mantequilla',
        descripcion: 'Croissant hojaldrado con mantequilla francesa, recién horneado',
        precio: 2.50, categoria: 'bollo', stock: 30, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Bollo de Canela',
        descripcion: 'Bollo esponjoso con relleno de canela y glaseado de vainilla',
        precio: 3.00, categoria: 'bollo', stock: 25, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Brioche de Chocolate',
        descripcion: 'Pan brioche tierno relleno de crema de chocolate artesanal',
        precio: 3.50, categoria: 'bollo', stock: 20, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Napolitana de Crema',
        descripcion: 'Hojaldre relleno de crema pastelera, glaseado con huevo',
        precio: 2.80, categoria: 'bollo', stock: 22, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop',
    },
    // ── PASTELES ──
    {
        nombre: 'Pastel de Limón',
        descripcion: 'Pastel suave con crema de limón y merengue tostado',
        precio: 18.00, categoria: 'pastel', stock: 6, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Pastel de Manzana',
        descripcion: 'Apple pie con canela, nuez moscada y masa quebrada hojaldrada',
        precio: 16.00, categoria: 'pastel', stock: 8, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Pastel de Coco y Lima',
        descripcion: 'Bizcocho de coco con crema de lima y flores comestibles',
        precio: 20.00, categoria: 'pastel', stock: 4, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=300&fit=crop',
    },
    // ── GALLETAS ──
    {
        nombre: 'Galletas de Avena y Chocolate',
        descripcion: 'Pack de 12 galletas artesanales con pepitas de chocolate',
        precio: 7.50, categoria: 'galleta', stock: 20, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Galletas de Mantequilla',
        descripcion: 'Pack de 12 galletas de mantequilla con azúcar perlado',
        precio: 6.50, categoria: 'galleta', stock: 25, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Macarons surtidos',
        descripcion: 'Caja de 6 macarons de: frambuesa, pistache, chocolate, limón, vainilla y lavanda',
        precio: 12.00, categoria: 'galleta', stock: 15, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=300&fit=crop',
    },
    // ── EXTRAS ──
    {
        nombre: 'Tarta de Cumpleanos',
        descripcion: 'Bizcocho de vainilla con buttercream de fresa, decorada a mano para celebraciones',
        precio: 35.00, categoria: 'tarta', stock: 4, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Eclair de Cafe',
        descripcion: 'Pasta choux rellena de crema de cafe y glaseado oscuro brillante',
        precio: 3.80, categoria: 'pastel', stock: 18, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Brownie de Chocolate',
        descripcion: 'Brownie americano denso con nueces y pepitas de chocolate negro',
        precio: 4.00, categoria: 'pastel', stock: 20, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Limonada de Menta',
        descripcion: 'Limonada artesanal con menta fresca y sirope de agave',
        precio: 3.20, categoria: 'bebida', stock: 35, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Chocolate a la Taza',
        descripcion: 'Chocolate puro espeso a la manera tradicional espanola, ideal con churros',
        precio: 3.50, categoria: 'bebida', stock: 45, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop',
    },

    // ── BEBIDAS ──
    {
        nombre: 'Café con Leche',
        descripcion: 'Café de especialidad con leche entera vaporizada',
        precio: 2.00, categoria: 'bebida', stock: 100, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Zumo de Naranja Natural',
        descripcion: 'Zumo exprimido al momento con naranjas de temporada',
        precio: 3.50, categoria: 'bebida', stock: 50, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Frapé de Fresas',
        descripcion: 'Batido de fresas naturales con helado de vainilla y nata',
        precio: 5.00, categoria: 'bebida', stock: 30, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop',
    },
    {
        nombre: 'Matcha Latte',
        descripcion: 'Leche al vapor con matcha ceremonial japonés de primera calidad',
        precio: 4.50, categoria: 'bebida', stock: 40, disponible: true,
        imagen: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop',
    },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Conectado a MongoDB: ${MONGO_URI}`);

        // Limpiar colecciones
        await Promise.all([
            Cliente.deleteMany({}),
            Producto.deleteMany({}),
            Compra.deleteMany({}),
        ]);
        console.log('Colecciones limpiadas');

        // Insertar datos
        const clientes = await Cliente.insertMany(clientesData);
        const productos = await Producto.insertMany(productosData);
        console.log(`${clientes.length} clientes insertados`);
        console.log(`${productos.length} productos insertados`);

        // Compras de ejemplo
        const comprasData = [
            {
                cliente: clientes[0]._id,
                lineas: [
                    { producto: productos[0]._id, cantidad: 1, precioUnitario: productos[0].precio, subtotal: productos[0].precio },
                    { producto: productos[15]._id, cantidad: 2, precioUnitario: productos[15].precio, subtotal: productos[15].precio * 2 },
                ],
                total: productos[0].precio + productos[15].precio * 2,
                estado: 'entregado', descripcion: 'Pedido cumpleaños',
            },
            {
                cliente: clientes[1]._id,
                lineas: [
                    { producto: productos[5]._id, cantidad: 4, precioUnitario: productos[5].precio, subtotal: productos[5].precio * 4 },
                    { producto: productos[12]._id, cantidad: 2, precioUnitario: productos[12].precio, subtotal: productos[12].precio * 2 },
                ],
                total: productos[5].precio * 4 + productos[12].precio * 2,
                estado: 'confirmado',
            },
            {
                cliente: clientes[2]._id,
                lineas: [
                    { producto: productos[1]._id, cantidad: 1, precioUnitario: productos[1].precio, subtotal: productos[1].precio },
                    { producto: productos[9]._id, cantidad: 1, precioUnitario: productos[9].precio, subtotal: productos[9].precio },
                    { producto: productos[16]._id, cantidad: 3, precioUnitario: productos[16].precio, subtotal: productos[16].precio * 3 },
                ],
                total: productos[1].precio + productos[9].precio + productos[16].precio * 3,
                estado: 'enviado', descripcion: 'Pedido para reunión de empresa',
            },
            {
                cliente: clientes[3]._id,
                lineas: [
                    { producto: productos[4]._id, cantidad: 1, precioUnitario: productos[4].precio, subtotal: productos[4].precio },
                    { producto: productos[18]._id, cantidad: 2, precioUnitario: productos[18].precio, subtotal: productos[18].precio * 2 },
                ],
                total: productos[4].precio + productos[18].precio * 2,
                estado: 'pendiente', descripcion: 'Pedido para boda',
            },
        ];

        const compras = await Compra.insertMany(comprasData);
        console.log(`${compras.length} compras insertadas`);
        console.log('\nSeed completado con éxito');
        console.log(`  Clientes : ${clientes.length}`);
        console.log(`  Productos: ${productos.length}`);
        console.log(`  Compras  : ${compras.length}`);

    } catch (error) {
        console.error('Error durante el seed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
