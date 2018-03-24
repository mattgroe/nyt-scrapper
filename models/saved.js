const mongoose = require('mongoose');

const savedSchema = mongoose.Schema({

    saved_id: mongoose.Schema.Types.ObjectId
    
});


module.exports = mongoose.model('Saved', savedSchema);