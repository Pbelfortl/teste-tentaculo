import { useEffect, useState } from 'react';
import './App.scss';
import Board from './components/board/board';
import Calendar from './components/calendar/calendar';


function App() {

  const [tasks, setTasks] = useState([])
  const [columns, setColumns] = useState([])

  useEffect(() => {
  if(window.localStorage.getItem("columns") && window.localStorage.getItem("tasks")){
    setTasks(JSON.parse(window.localStorage.getItem("tasks")))
    setColumns(JSON.parse(window.localStorage.getItem("columns")))
  } else {
    setTasks([])
    setColumns([
      { id: "todo", title: "To do" },
      { id: "doing", title: "Doing" },
      { id: "done", title: "Done" }
    ])
  }
  }, [])

  return (
    <div className="Container">
      <Board columns={columns} setColumns={setColumns} tasks={tasks} setTasks={setTasks}/>
      <Calendar events={tasks}/>
    </div>
  );
}

export default App;
