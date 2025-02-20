import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task }) {
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
      </div>
    </div>
  );
}
