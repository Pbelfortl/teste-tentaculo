import './board.scss'
import { useState, useMemo } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from '../card/card';
import ColumnContainer from '../colunm/colunm';


const defaultCols = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" }
]

const defaultTasks = [
  { id:1, columnId: "todo", title: "Sleep", description: "sleep 8 hrs", date: "2023-10-20" },
  { id:2, columnId: "doing", title: "Sleep", description: "sleep 8 hrs", date: "2023-10-20" },
  { id:4, columnId: "done", title: "Sleep", description: "sleep 8 hrs", date: "2023-10-20" },
  { id:5, columnId: "done", title: "Sleep", description: "sleep 8 hrs", date: "2023-10-20" }
]

export default function Board({columns, setColumns, tasks, setTasks}) {

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (

    <div
      className="board">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div>
          <div>
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="addColunm">
            <ion-icon name="add-circle-outline"></ion-icon>
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      description: `New task`,
    };
    window.localStorage.setItem("tasks", (JSON.stringify([...tasks, newTask])))
    setTasks([...tasks, newTask]);
  }
  
  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    window.localStorage.setItem("tasks", (JSON.stringify(newTasks)))
    setTasks(newTasks);
  }
  
  function updateTask(id, title, description, date) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, title, description, date };
    });
    window.localStorage.setItem("tasks", (JSON.stringify(newTasks)))
    setTasks(newTasks);
  }
  
  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    
    window.localStorage.setItem("columns", (JSON.stringify([...columns, columnToAdd])))
    setColumns([...columns, columnToAdd]);
  }
  
  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    window.localStorage.setItem("columns", (JSON.stringify(filteredColumns)))
    setColumns(filteredColumns);
  
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }
  
  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
  
    setColumns(newColumns);
  }
  
  function onDragStart(event) {
  
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }
  
  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);
    console.log(event)
  
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;
  
    console.log("DRAG END");
  
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
  
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
  
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }
  
  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;
  
    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
  
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
  
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  
    const isOverAColumn = over.data.current?.type === "Column";
  
    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
  
        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
/* Generate a random number between 0 and 10000 */
return Math.floor(Math.random() * 10001);
}
