import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import "./card.scss"

export default function TaskCard({ task, deleteTask, updateTask }) {

  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div className="dragging" ref={setNodeRef} style={style} />
    )
  }

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="editTask">
        <input value={task.title} onChange={(e) => updateTask(task.id, e.target.value, task.description, task.date)} />
        <textarea
          className="taskText"
          value={task.description}
          onChange={(e) => updateTask(task.id, task.title, e.target.value, task.date)}
        />
        <input type="date" value={task.date} onChange={(e) => updateTask(task.id, task.title, task.description, e.target.value)} />
        <button onClick={() => toggleEditMode()}>
          <ion-icon name="checkmark-circle-outline"></ion-icon>
        </button>
      </div>
    );
  }

  return (

    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p><strong>{task.title}</strong></p>
      <p>{task.description}</p>
      <b>{task.date}</b>

      {mouseIsOver && (
        <div>
          <button onClick={() => toggleEditMode()} className="editButton">
            <ion-icon name="pencil-outline"></ion-icon>
          </button>
          <button onClick={() => { deleteTask(task.id) }} className="deleteButton">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>  
      )}
    </div>

  )

}