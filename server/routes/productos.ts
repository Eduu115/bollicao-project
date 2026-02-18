import express from 'express';
import productoController from '../controllers/productoControllers';

const router = express.Router();

router.get('/', productoController.getAllProductos);
router.get('/:id/compras', productoController.getProductoConCompras); // ← populate
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);
router.put('/:id', productoController.updateProducto);
router.delete('/:id', productoController.deleteProducto);

export default router;
