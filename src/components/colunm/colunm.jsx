import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "../card/card";
import  "./colunm.scss"


export default function ColumnContainer({column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask}) {
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="colunmDrag"/>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="colunm">
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="colunmHeader"
      >
        <div>
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button onClick={() => {deleteColumn(column.id)}} className="deleteColunm">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>

      {/* Column task container */}
      <div className="colunmContainer">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="colunmFooter"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <ion-icon name="add-circle-outline"></ion-icon>
        Add task
      </button>
    </div>
  );
}
