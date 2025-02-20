import TaskBoard from './TaskBoard';

const HomePage = () => {
  return (
    <main className='min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-8 px-4'>
      <div className='w-10/12 mx-auto'>
        <h1 className='text-4xl font-bold mb-8 text-center text-white'>
          Task Board
        </h1>
        <TaskBoard />
      </div>
    </main>
  );
};

export default HomePage;
