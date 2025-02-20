export default function TaskCard({ task }) {
  return (
    <div className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200'>
      <h3 className='font-semibold mb-2 text-purple-700'>{task.title}</h3>
      <p className='text-sm text-gray-600'>{task.description}</p>
    </div>
  );
}
