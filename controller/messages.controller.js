const Message = require('../models/messages.model');

exports.getAll = async (req, res) => {
    try {
      res.json(await Message.find());
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };
  
  exports.getById = async (req, res) => {

    try {
      const messageToSelect = await Message.findById(req.params.id);
      if(!messageToSelect) res.status(404).json({ message: 'Message not found' });
      else res.json(messagesToSelect);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };
  
  exports.addNew = async (req, res) => {
 
    try {
    const { author, content } = req.body;
    console.log(req.body);

    const newMessage = new Message({ author, content });
      await newMessage.save();
      res.json({ message: 'OK' });
    // req.io.emit('messagesUpdated', JSON.stringify(await Message.find()));
  
    } catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.edit = async (req, res) => {
    try {
        const { author, content } = req.body;

    
      const messageToUpdate = await Message.findById(req.params.id);
      if(messageToUpdate) {
        await Message.updateOne({ _id: req.params.id }, { $set: { author, content }});
        res.status(200).json({ message: 'OK' });
      }
     else res.status(404).json({ error: 'Message not found' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };
  
  exports.delete = async (req, res) => {

    try {
      const messageToDelete = await Message.findById(req.params.id);
      if(messageToDelete) {
        await Message.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Message deleted successfully' });
      }
      else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };
  
  
  
  
  