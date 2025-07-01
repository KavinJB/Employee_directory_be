// models/counter.model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CounterSchema = new Schema({
  _id: { type: String, required: true }, // name of the counter (e.g. 'employeeCode')
  seq: { type: Number, default: 1000 }   // starting point
});

const Counter = model('Counter', CounterSchema);
export default Counter;