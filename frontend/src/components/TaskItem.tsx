import React, { memo } from 'react';
import { Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';
import { toggleTaskComplete, deleteTask } from '../store/slices/taskSlice';
import type { Task } from '../store/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem = memo(({ task, onEdit }: TaskItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin = user?.role === 'admin';
  const isOwner = typeof task.userId === 'object' ? task.userId._id === user?._id : task.userId === user?._id;
  const canModify = isAdmin || isOwner;

  const handleToggleStatus = () => {
    if (!canModify) return;
    dispatch(toggleTaskComplete(task._id));
  };

  const handleDelete = () => {
    if (!canModify) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task._id));
    }
  };

  // Priority Badge colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
    }
  };

  // Status Badge colors
  const getStatusColor = (completed: boolean) => {
    return completed 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200';
  };

  // Row background color (completed row in green, pending in yellow)
  const rowClass = task.completed 
    ? 'bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50' 
    : 'bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-100/50';

  return (
    <tr className={`border-b transition-colors ${rowClass}`}>
      <td className="p-4 align-top">
        <button 
          onClick={handleToggleStatus}
          disabled={!canModify}
          className={`flex items-center justify-center transition-colors ${!canModify ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-green-600'} ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
        >
          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
      </td>
      <td className="p-4 align-top max-w-[200px] sm:max-w-xs">
        <h3 className={`font-semibold truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm line-clamp-2">
            {task.description}
          </p>
        )}
      </td>
      <td className="p-4 align-top whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </td>
      <td className="p-4 align-top whitespace-nowrap hidden sm:table-cell">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.completed)}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </td>
      <td className="p-4 align-top whitespace-nowrap hidden md:table-cell text-sm text-gray-500">
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
      </td>
      {isAdmin && (
        <td className="p-4 align-top whitespace-nowrap hidden lg:table-cell text-sm text-primary max-w-[120px] truncate">
          {typeof task.userId === 'object' ? task.userId.name : 'Unknown'}
        </td>
      )}
      <td className="p-4 align-top whitespace-nowrap text-right">
        {canModify && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleToggleStatus}
              title="Mark Done"
              className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
            >
              <CheckCircle2 size={18} />
            </button>
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Task"
              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
});

export default TaskItem;
