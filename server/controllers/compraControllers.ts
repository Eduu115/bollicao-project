import { Request, Response } from 'express';
import { Compra } from '../models/Compra';
import { Cliente } from '../models/Cliente';

const compraController = {

    // GET /api/compras
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

    // GET /api/compras/:id  ← POPULATE COMPLETO
    // Devuelve una compra con el cliente y cada producto de las líneas populados
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

    // POST /api/compras
    createCompra: async (req: Request, res: Response) => {
        try {
            const nuevaCompra = new Compra(req.body);
            const compraGuardada = await nuevaCompra.save();

            // Acumular puntos y total gastado en el cliente
            await Cliente.findByIdAndUpdate(compraGuardada.cliente, {
                $inc: {
                    puntosTotales: compraGuardada.puntosGenerados,
                    totalGastado: compraGuardada.total,
                },
            });

            // Devolvemos con populate para que el cliente vea los datos completos
            const compraDetalle = await Compra.findById(compraGuardada._id)
                .populate('cliente', 'nombre email')
                .populate('lineas.producto', 'nombre precio categoria');
            res.status(201).json(compraDetalle);
        } catch (error: any) {
            res.status(400).json({ mensaje: 'Error al crear la compra', error: error.message });
        }
    },

    // PUT /api/compras/:id  (actualizar estado principalmente)
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

    // DELETE /api/compras/:id  (cancelación lógica)
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
