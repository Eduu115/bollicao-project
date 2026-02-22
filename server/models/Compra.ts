import { Schema, model, Document, Types } from 'mongoose';

export interface ILineaCompra {
    producto: Types.ObjectId;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
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
    { _id: false }
);

export interface ICompra extends Document {
    cliente: Types.ObjectId;
    lineas: ILineaCompra[];
    total: number;
    puntosGenerados: number;
    estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
    descripcion?: string;
    fechaCompra: Date;
}

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

CompraSchema.pre('save', async function () {
    if (this.isNew) {
        this.puntosGenerados = Math.floor(this.total / 10);
    }
});

export const Compra = model<ICompra>('Compra', CompraSchema);
