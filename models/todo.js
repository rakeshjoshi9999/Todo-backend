const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todo = new Schema({
    todo_name: { type: String, required: true },
    details: { type: String, required: true },
    created_date: { type: Date, default: Date.now, required: true },
    user_id: { type: Schema.ObjectId, ref: 'user' },
    status: { type: String, enum: ["completed", "pending"], required: true, default: "pending" },
    important: { type: Boolean, required: true, default: false }
});

const ToDo = mongoose.model('ToDo', todo);

module.exports.ToDo = ToDo;
