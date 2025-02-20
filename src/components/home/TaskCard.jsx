import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import useTasks from '../../hooks/useTasks';

export default function TaskCard({ task }) {
  const { refetchTasks } = useTasks();
  const { setNodeRef, attributes, listeners, transition, transform } =
    useSortable({
      id: task.id,
      data: {
        type: 'task',
        task,
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:5001/tasks/${task._id}`);
      if (res?.data?.success) {
        refetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-grab mb-5'
    >
      <div>
        <h3 className='font-semibold mb-2 text-purple-700'>{task.title}</h3>
        <p className='text-sm text-gray-600 mb-2'>{task.description}</p>
        <div className='flex justify-between items-center text-xs text-gray-500'>
          <span>{task.category}</span>
          <span>{new Date(task.timestamp).toLocaleString()}</span>
        </div>
        <button
          onClick={handleDelete}
          className='mt-2 text-red-500 cursor-pointer hover:text-red-700 text-xs'
        >
          Delete
        </button>
      </div>
    </div>
  );
}
