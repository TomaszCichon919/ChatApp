const express = require('express');
const router = express.Router();

const MessageController = require('../controller/messages.controller');

router.get('/messages', MessageController.getAll);
router.get('/messages/:id', MessageController.getById);
router.post('/messages', MessageController.addNew);
router.put('/messages/:id', MessageController.edit);
router.delete('/messages/:id', MessageController.delete);

module.exports = router;