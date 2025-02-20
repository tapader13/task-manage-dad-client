import { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import axios from 'axios';
import { closestCorners, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function TaskColumn({ category }) {
  const [task, setTask] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get('http://localhost:5001/tasks');
      if (res.data.success) {
        setTask(res.data.data);
      }
    };
    fetchTasks();
  }, []);
  console.log(task);
  const filteredTasks =
    task && task.filter((task) => task.category === category);
  return (
    <DndContext collisionDetection={closestCorners}>
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={filteredTasks.map((task) => task._id)}
      >
        <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-purple-700'>
            {category}
          </h2>
          <div className='space-y-4'>
            {filteredTasks?.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}
