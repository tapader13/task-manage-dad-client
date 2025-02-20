import { useEffect, useMemo, useState } from 'react';
import TaskColumn from './TaskColumn';
import AddTaskButton from './AddTaskBUtton';
import AddTaskModal from './AddTaskModal';
import ColumnContainer from './ColumnContainer';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import useTasks from '../../hooks/useTasks';
import axios from 'axios';

export default function TaskBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'To Do',
    },
    {
      id: '2',
      name: 'In Progress',
    },
    {
      id: '3',
      name: 'Done',
    },
  ]);
  const { tasks: ts, refetchTasks } = useTasks();
  const [tasks, setTasks] = useState([
    // {
    //   id: 1,
    //   title: 'Task 1',
    //   description: 'Description 1',
    //   category: 'To Do',
    //   columnId: '1',
    //   timestamp: new Date().toISOString(),
    //   orderid: 1,
    // },
    // {
    //   id: 2,
    //   title: 'Task 2',
    //   description: 'Description 2',
    //   category: 'To Do',
    //   columnId: '1',
    //   timestamp: new Date().toISOString(),
    //   orderid: 2,
    // },
  ]);
  // useEffect(() => {
  //   if (Array.isArray(ts)) {
  //     setTasks(ts);
  //   } else {
  //     setTasks([]);
  //   }
  // }, [ts]);
  useEffect(() => {
    // Ensure tasks are set only if the response is a valid array
    if (Array.isArray(ts) && ts.length) {
      setTasks(ts); // Only update if there are valid tasks
    } else {
      setTasks([]); // Clear tasks if ts is not valid
    }
  }, [ts]); // Dependencies ensure this runs when ts changes

  const coloumsId = useMemo(
    () => categories.map((category) => category.id),
    [categories]
  );
  const handleDragStart = (event) => {
    console.log(event);
    if (event.active.data.current?.type === 'column') {
      console.log('Column drag');
      setActiveColumn(event.active.data.current.category);
      return;
    }
  };

  console.log(ts, 'ts');
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) {
      return;
    }
    setCategories((categories) => {
      const activeColumnIndex = categories.findIndex(
        (category) => category.id === activeColumnId
      );
      const overColumnIndex = categories.findIndex(
        (category) => category.id === overColumnId
      );
      return arrayMove(categories, activeColumnIndex, overColumnIndex);
    });
  };
  const sensors = useSensors(
    useSensor(
      PointerSensor,
      {
        activationConstraint: {
          distance: 20,
        },
      },
      TouchSensor
    )
  );
  const handleDragOver = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) {
      return;
    }
    console.log(active, over);
    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';
    if (!isActiveTask) return;
    if (isActiveTask && isOverTask) {
      let reorderTasks = [];
      setTasks((tasks) => {
        const activeTaskIndex = tasks?.findIndex(
          (task) => task.id === active.id
        );
        const overTaskIndex = tasks?.findIndex((task) => task.id === over.id);
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        const reorderedTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);

        // Set correct orderid for each task
        reorderTasks = reorderedTasks.map((task, index) => ({
          ...task,
          orderid: index + 1, // Update orderid based on new position
        }));
        console.log(reorderTasks, 'reorderTasks');

        return reorderedTasks;
        // return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
      try {
        const res = await axios.put(
          'http://localhost:5001/tasks',
          reorderTasks
        );

        if (res?.data?.success) {
          refetchTasks(); // Refetch tasks after successful update
        }
      } catch (error) {
        console.error('Error updating tasks:', error);
      }
    }
    const isOverColumn = over.data.current?.type === 'column';
    if (isActiveTask && isOverColumn) {
      let finalOrder = [];
      setTasks((tasks) => {
        const activeTaskIndex = tasks?.findIndex(
          (task) => task.id === active.id
        );
        tasks[activeTaskIndex].columnId = over.id;
        const reorderTask = arrayMove(tasks, activeTaskIndex, activeTaskIndex);
        finalOrder = reorderTask.map((task, index) => ({
          ...task,
          orderid: index + 1,
        }));
        console.log(finalOrder, 'finalOrder');
        return reorderTask;
        // return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
      try {
        const res = await axios.put('http://localhost:5001/tasks', finalOrder);

        if (res?.data?.success) {
          refetchTasks(); // Refetch tasks after successful update
        }
      } catch (error) {
        console.error('Error updating tasks:', error);
      }
    }
  };
  return (
    <div className='space-y-8'>
      <AddTaskButton onClick={() => setIsModalOpen(true)} />
      <DndContext
        onDragOver={handleDragOver}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <SortableContext items={coloumsId}>
            {/* {tasks?.length > 0 &&
              categories.map((category) => (
                <ColumnContainer
                  tasks={tasks.filter((task) => task.columnId === category.id)}
                  key={category.id}
                  category={category}
                />
              ))} */}
            {categories.map((category) => (
              <ColumnContainer
                tasks={tasks?.filter((task) => task.columnId === category.id)}
                key={category.id}
                category={category}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
