import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ITask extends Document {
  userId: IUser['_id'];
  title: string;
  description?: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
