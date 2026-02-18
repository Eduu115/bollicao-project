import { Schema, model, Document } from 'mongoose';

// ─── Interfaz TypeScript ───────────────────────────────────────────────────
export interface IProducto extends Document {
    nombre: string;
    descripcion: string;
    precio: number;              // precio unitario en €
    categoria: string;           // ej: 'tarta', 'bollo', 'pastel', 'bebida'
    imagen?: string;             // URL de la imagen
    disponible: boolean;
    stock: number;
    creadoEn: Date;
}

// ─── Schema ────────────────────────────────────────────────────────────────
const ProductoSchema = new Schema<IProducto>(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            trim: true,
            maxlength: 150,
        },
        descripcion: {
            type: String,
            trim: true,
            default: '',
        },
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo'],
        },
        categoria: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            enum: ['tarta', 'bollo', 'pastel', 'galleta', 'bebida', 'otro'],
            default: 'otro',
        },
        imagen: {
            type: String,
        },
        disponible: {
            type: Boolean,
            default: true,
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
    }
);

export const Producto = model<IProducto>('Producto', ProductoSchema);
