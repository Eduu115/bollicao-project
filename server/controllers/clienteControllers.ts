import { Request, Response } from 'express';
import { Cliente } from '../models/Cliente';
import { Compra } from '../models/Compra';

const clienteController = {

    // GET /api/clientes
    getAllClientes: async (req: Request, res: Response) => {
        try {
            const clientes = await Cliente.find({ activo: true }).select('-passwordHash');
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener los clientes', error });
        }
    },

    // GET /api/clientes/:id
    getClienteById: async (req: Request, res: Response) => {
        try {
            const cliente = await Cliente.findById(req.params.id).select('-passwordHash');
            if (!cliente) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }
            res.json(cliente);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el cliente', error });
        }
    },

    // GET /api/clientes/:id/compras  ← POPULATE
    // Devuelve el cliente junto con todas sus compras,
    // y dentro de cada compra popula los datos completos de cada producto
    getClienteConCompras: async (req: Request, res: Response) => {
        try {
            const cliente = await Cliente.findById(req.params.id).select('-passwordHash');
            if (!cliente) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }

            const compras = await Compra.find({ cliente: req.params.id })
                .populate('lineas.producto', 'nombre precio categoria imagen') // populate productos
                .sort({ fechaCompra: -1 });

            res.json({ cliente, compras });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las compras del cliente', error });
        }
    },

    // POST /api/clientes
    createCliente: async (req: Request, res: Response) => {
        try {
            const { nombre, email, passwordHash, telefono, direccion } = req.body;
            const nuevoCliente = new Cliente({ nombre, email, passwordHash, telefono, direccion });
            const clienteGuardado = await nuevoCliente.save();
            const { passwordHash: _, ...clienteSinPassword } = clienteGuardado.toObject();
            res.status(201).json(clienteSinPassword);
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(409).json({ mensaje: 'Ya existe un cliente con ese email' });
            }
            res.status(400).json({ mensaje: 'Error al crear el cliente', error: error.message });
        }
    },

    // PUT /api/clientes/:id
    updateCliente: async (req: Request, res: Response) => {
        try {
            const { passwordHash, ...datosActualizables } = req.body;
            const clienteActualizado = await Cliente.findByIdAndUpdate(
                req.params.id,
                datosActualizables,
                { new: true, runValidators: true }
            ).select('-passwordHash');
            if (!clienteActualizado) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }
            res.json(clienteActualizado);
        } catch (error: any) {
            res.status(400).json({ mensaje: 'Error al actualizar el cliente', error: error.message });
        }
    },

    // DELETE /api/clientes/:id  (baja lógica)
    deleteCliente: async (req: Request, res: Response) => {
        try {
            const cliente = await Cliente.findByIdAndUpdate(
                req.params.id,
                { activo: false },
                { new: true }
            );
            if (!cliente) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }
            res.json({ mensaje: 'Cliente desactivado correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar el cliente', error });
        }
    },
};

export default clienteController;
