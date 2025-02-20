import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ColumnContainer = ({ category }) => {
  const { setNodeRef, attributes, listeners, transition, transform } =
    useSortable({
      id: category.id,
      data: {
        type: 'column',
        category,
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
      className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 h-[500px] flex flex-col'
    >
      <div className='font-semibold mb-2 text-purple-700 text-lg'>
        {category.name}
      </div>
      <div className='flex-grow'>content</div>
    </div>
  );
};

export default ColumnContainer;
