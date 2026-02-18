import express from 'express';
import compraController from '../controllers/compraControllers';

const router = express.Router();

router.get('/', compraController.getAllCompras);
router.get('/:id', compraController.getCompraConDetalle);   // ← con populate completo
router.post('/', compraController.createCompra);
router.put('/:id', compraController.updateCompra);
router.delete('/:id', compraController.deleteCompra);

export default router;
