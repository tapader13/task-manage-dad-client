import { useMemo, useState } from 'react';
import TaskColumn from './TaskColumn';
import AddTaskButton from './AddTaskBUtton';
import AddTaskModal from './AddTaskModal';
import ColumnContainer from './ColumnContainer';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

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
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      category: 'To Do',
      timestamp: new Date(),
      columnId: '1',
      orderid: 1,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      category: 'To Do',
      timestamp: new Date(),
      columnId: '1',
      orderid: 2,
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      category: 'Done',
      timestamp: new Date(),
      columnId: '3',
      orderid: 3,
    },
  ]);
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 50,
      },
    })
  );
  const handleDragOver = (event) => {
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
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === active.id
        );
        const overTaskIndex = tasks.findIndex((task) => task.id === over.id);
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        const reorderedTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);

        // Set correct orderid for each task
        const updatedTasks = reorderedTasks.map((task, index) => ({
          ...task,
          orderid: index + 1, // Update orderid based on new position
        }));
        console.log(updatedTasks);
        return reorderedTasks;
        // return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }
    const isOverColumn = over.data.current?.type === 'column';
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === active.id
        );
        tasks[activeTaskIndex].columnId = over.id;
        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
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
            {categories.map((category) => (
              <ColumnContainer
                tasks={tasks.filter((task) => task.columnId === category.id)}
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
