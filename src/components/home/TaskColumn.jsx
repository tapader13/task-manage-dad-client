import TaskCard from './TaskCard';

const dummyTasks = [
  {
    id: '1',
    title: 'Design UI',
    description: 'Create a cool design for the task board',
  },
  {
    id: '2',
    title: 'Implement frontend',
    description: 'Build the React components',
  },
  {
    id: '3',
    title: 'Write documentation',
    description: 'Document the project structure and setup',
  },
];

export default function TaskColumn({ category }) {
  return (
    <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-lg'>
      <h2 className='text-xl font-semibold mb-4 text-white'>{category}</h2>
      <div className='space-y-4'>
        {dummyTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
