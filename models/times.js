const mongoose = require('mongoose');

const timesSchema = mongoose.Schema({

    // times_id: mongoose.Schema.Types.ObjectId,
    title: { type: String, unique: true },
    link: { type: String }

});


module.exports = mongoose.model('Times', timesSchema);