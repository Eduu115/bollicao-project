import { Request, Response } from 'express';
import { Producto } from '../models/Producto';
import { Compra } from '../models/Compra';

const productoController = {

    // GET /api/productos
    getAllProductos: async (req: Request, res: Response) => {
        try {
            const { categoria, disponible } = req.query;
            const filtro: any = {};
            if (categoria) filtro.categoria = categoria;
            if (disponible !== undefined) filtro.disponible = disponible === 'true';
            const productos = await Producto.find(filtro);
            res.json(productos);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener los productos', error });
        }
    },

    // GET /api/productos/:id
    getProductoById: async (req: Request, res: Response) => {
        try {
            const producto = await Producto.findById(req.params.id);
            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            res.json(producto);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el producto', error });
        }
    },

    // GET /api/productos/:id/compras  ← POPULATE
    // Devuelve el producto junto con todas las compras en las que aparece,
    // y dentro de cada compra popula los datos del cliente
    getProductoConCompras: async (req: Request, res: Response) => {
        try {
            const producto = await Producto.findById(req.params.id);
            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            const compras = await Compra.find({ 'lineas.producto': req.params.id })
                .populate('cliente', 'nombre email telefono') // populate cliente
                .select('cliente total estado fechaCompra lineas')
                .sort({ fechaCompra: -1 });

            res.json({ producto, compras });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las compras del producto', error });
        }
    },

    // POST /api/productos
    createProducto: async (req: Request, res: Response) => {
        try {
            const nuevoProducto = new Producto(req.body);
            const productoGuardado = await nuevoProducto.save();
            res.status(201).json(productoGuardado);
        } catch (error: any) {
            res.status(400).json({ mensaje: 'Error al crear el producto', error: error.message });
        }
    },

    // PUT /api/productos/:id
    updateProducto: async (req: Request, res: Response) => {
        try {
            const productoActualizado = await Producto.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!productoActualizado) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            res.json(productoActualizado);
        } catch (error: any) {
            res.status(400).json({ mensaje: 'Error al actualizar el producto', error: error.message });
        }
    },

    // DELETE /api/productos/:id  (baja lógica)
    deleteProducto: async (req: Request, res: Response) => {
        try {
            const producto = await Producto.findByIdAndUpdate(
                req.params.id,
                { disponible: false },
                { new: true }
            );
            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            res.json({ mensaje: 'Producto desactivado correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar el producto', error });
        }
    },
};

export default productoController;