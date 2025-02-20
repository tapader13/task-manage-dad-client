import TaskCard from './TaskCard';

const dummyTasks = [
  {
    id: '1',
    title: 'Design UI',
    description: 'Create a cool design for the task board',
    timestamp: '2023-05-10T10:00:00Z',
    category: 'To Do',
  },
  {
    id: '2',
    title: 'Implement frontend',
    description: 'Build the React components',
    timestamp: '2023-05-10T11:00:00Z',
    category: 'In Progress',
  },
  {
    id: '3',
    title: 'Write documentation',
    description: 'Document the project structure and setup',
    timestamp: '2023-05-10T12:00:00Z',
    category: 'Done',
  },
];

export default function TaskColumn({ category }) {
  const filteredTasks = dummyTasks.filter((task) => task.category === category);
  return (
    <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-lg'>
      <h2 className='text-xl font-semibold mb-4 text-purple-700'>{category}</h2>
      <div className='space-y-4'>
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
