'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: String,
    msg: String,
    created: {type: Date, default: Date.now}
});

exports.Message = mongoose.model('Message', messageSchema);
