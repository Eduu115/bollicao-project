import { Schema, model, Document } from 'mongoose';

// ─── Interfaz TypeScript ───────────────────────────────────────────────────
export interface ICliente extends Document {
    nombre: string;
    email: string;
    passwordHash: string;
    telefono?: string;
    direccion?: string;
    puntosTotales: number;       // calculado a partir de las compras
    totalGastado: number;        // suma acumulada de todas sus compras
    activo: boolean;
    creadoEn: Date;
}

// ─── Schema ────────────────────────────────────────────────────────────────
const ClienteSchema = new Schema<ICliente>(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Formato de email no válido'],
        },
        passwordHash: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
        },
        telefono: {
            type: String,
            trim: true,
        },
        direccion: {
            type: String,
            trim: true,
        },
        puntosTotales: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalGastado: {
            type: Number,
            default: 0,
            min: 0,
        },
        activo: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
    }
);

export const Cliente = model<ICliente>('Cliente', ClienteSchema);
