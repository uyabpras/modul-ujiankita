const express = require('express');
const modulController = require('../controller/modul');

const router = express.Router();
router.get('/', modulController.list);
router.get('/:id', modulController.get);
router.post('/', modulController.add);
router.put('/:id', modulController.editModul);
router.delete('/:id', modulController.delete);
module.exports = router;