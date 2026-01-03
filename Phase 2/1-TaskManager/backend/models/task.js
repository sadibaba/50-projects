import { Schema, model } from 'mongoose';
const taskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  deadline: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});
export default model('Task', taskSchema);