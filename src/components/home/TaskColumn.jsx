import { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import axios from 'axios';

export default function TaskColumn({ category }) {
  const [task, tasks] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get('http://localhost:5001/tasks');
      if (res.data.success) {
        tasks(res.data.data);
      }
    };
    fetchTasks();
  }, []);
  console.log(task);
  const filteredTasks =
    task && task.filter((task) => task.category === category);
  return (
    <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-lg'>
      <h2 className='text-xl font-semibold mb-4 text-purple-700'>{category}</h2>
      <div className='space-y-4'>
        {filteredTasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
