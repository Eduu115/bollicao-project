import { Request, Response } from 'express';
import { Compra } from '../models/Compra';
import { Cliente } from '../models/Cliente';

const compraController = {

    getAllCompras: async (req: Request, res: Response) => {
        try {
            const compras = await Compra.find()
                .populate('cliente', 'nombre email')
                .sort({ fechaCompra: -1 });
            res.json(compras);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las compras', error });
        }
    },

    getCompraConDetalle: async (req: Request, res: Response) => {
        try {
            const compra = await Compra.findById(req.params.id)
                .populate('cliente', 'nombre email telefono direccion puntosTotales')
                .populate('lineas.producto', 'nombre precio categoria imagen');

            if (!compra) {
                return res.status(404).json({ mensaje: 'Compra no encontrada' });
            }
            res.json(compra);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener la compra', error });
        }
    },

    createCompra: async (req: Request, res: Response) => {
        try {
            const nuevaCompra = new Compra(req.body);
            const compraGuardada = await nuevaCompra.save();

            await Cliente.findByIdAndUpdate(compraGuardada.cliente, {
                $inc: {
                    puntosTotales: compraGuardada.puntosGenerados,
                    totalGastado: compraGuardada.total,
                },
            });

            const compraDetalle = await Compra.findById(compraGuardada._id)
                .populate('cliente', 'nombre email')
                .populate('lineas.producto', 'nombre precio categoria');
            res.status(201).json(compraDetalle);
        } catch (error: any) {
            res.status(400).json({ mensaje: 'Error al crear la compra', error: error.message });
        }
    },

    updateCompra: async (req: Request, res: Response) => {
        try {
            const compraActualizada = await Compra.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            )
                .populate('cliente', 'nombre email')
                .populate('lineas.producto', 'nombre precio categoria');

            if (!compraActualizada) {
                return res.status(404).json({ mensaje: 'Compra no encontrada' });
            }
            res.json(compraActualizada);
        } catch (error: any) {
            res.status(400).json({ mensaje: 'Error al actualizar la compra', error: error.message });
        }
    },

    deleteCompra: async (req: Request, res: Response) => {
        try {
            const compra = await Compra.findByIdAndUpdate(
                req.params.id,
                { estado: 'cancelado' },
                { new: true }
            );
            if (!compra) {
                return res.status(404).json({ mensaje: 'Compra no encontrada' });
            }
            res.json({ mensaje: 'Compra cancelada correctamente', compra });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al cancelar la compra', error });
        }
    },
};

export default compraController;
