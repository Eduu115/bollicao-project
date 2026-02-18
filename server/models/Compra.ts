import { Schema, model, Document, Types } from 'mongoose';

// ─── Sub-schema: línea de producto dentro de una compra ────────────────────
// Una compra puede incluir varios productos (carrito)
export interface ILineaCompra {
    producto: Types.ObjectId;    // ref → Producto
    cantidad: number;
    precioUnitario: number;      // precio en el momento de la compra (snapshot)
    subtotal: number;            // cantidad × precioUnitario
}

const LineaCompraSchema = new Schema<ILineaCompra>(
    {
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Producto',
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
            min: [1, 'La cantidad mínima es 1'],
        },
        precioUnitario: {
            type: Number,
            required: true,
            min: 0,
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false } // no necesita _id propio, es un subdocumento
);

// ─── Interfaz principal ────────────────────────────────────────────────────
export interface ICompra extends Document {
    cliente: Types.ObjectId;     // ref → Cliente
    lineas: ILineaCompra[];      // productos comprados
    total: number;               // suma de todos los subtotales
    puntosGenerados: number;     // 1 punto por cada 10 € (regla de negocio)
    estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
    descripcion?: string;        // resumen libre, ej: "Tarta personalizada"
    fechaCompra: Date;
}

// ─── Schema principal ──────────────────────────────────────────────────────
const CompraSchema = new Schema<ICompra>(
    {
        cliente: {
            type: Schema.Types.ObjectId,
            ref: 'Cliente',
            required: [true, 'La compra debe estar asociada a un cliente'],
            index: true,
        },
        lineas: {
            type: [LineaCompraSchema],
            required: true,
            validate: {
                validator: (v: ILineaCompra[]) => v.length > 0,
                message: 'La compra debe tener al menos un producto',
            },
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        puntosGenerados: {
            type: Number,
            default: 0,
            min: 0,
        },
        estado: {
            type: String,
            enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
            default: 'pendiente',
        },
        descripcion: {
            type: String,
            trim: true,
        },
        fechaCompra: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
    }
);

// ─── Hook: calcular puntos y actualizar totales del cliente ────────────────
// Se ejecuta automáticamente al guardar una compra nueva
CompraSchema.pre('save', async function () {
    if (this.isNew) {
        // Regla de negocio: 1 punto por cada 10 € gastados
        this.puntosGenerados = Math.floor(this.total / 10);
    }
});

export const Compra = model<ICompra>('Compra', CompraSchema);
