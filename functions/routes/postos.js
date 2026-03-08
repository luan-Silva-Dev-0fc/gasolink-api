const express = require('express');
const router = express.Router();
const postosController = require('./../controllers/postosController');

router.get('/', postosController.getPostos);
router.post('/', postosController.createPosto);
router.put('/:id', postosController.updatePosto);
router.delete('/:id', postosController.deletePosto);

module.exports = router;