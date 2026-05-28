import type { Task } from '../store/slices/taskSlice';
import TaskItem from './TaskItem';
import { Loader2, CheckSquare } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  isAdmin: boolean;
}

const TaskList = ({ tasks, isLoading, onEdit, isAdmin }: TaskListProps) => {
  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 glass-panel">
        <CheckSquare className="mx-auto text-gray-300 mb-4" size={64} />
        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No tasks found</h3>
        <p className="text-gray-400 mt-2">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 border-b border-border">
          <tr>
            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-12 text-center">Status</th>
            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Task Details</th>
            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-24">Priority</th>
            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell w-32">State</th>
            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell w-32">Due Date</th>
            {isAdmin && (
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell w-32">Owner</th>
            )}
            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
