import { useState } from 'react';
import TaskColumn from './TaskColumn';
import AddTaskButton from './AddTaskBUtton';
import AddTaskModal from './AddTaskModal';

const categories = ['To Do', 'In Progress', 'Done'];

export default function TaskBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='space-y-8'>
      <AddTaskButton onClick={() => setIsModalOpen(true)} />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {categories.map((category) => (
          <TaskColumn key={category} category={category} />
        ))}
      </div>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
