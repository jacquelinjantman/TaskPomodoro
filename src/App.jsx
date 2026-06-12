
import { useState, useEffect, useRef } from "react"
import mascot from "./assets/mascot.gif"
import "./App.css"




function App() {

  const [tasks, setTask] = useState(()=>{
    const saved = localStorage.getItem("tasks")
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState("")
  const [seconds, setSeconds] = useState (25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState ("work")
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const intervalRef = useRef (null)

    useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])
  
const start = () => {
  if (isRunning) return
  setIsRunning(true)
  intervalRef.current = setInterval(() => {
    setSeconds(s => {
      if (s <= 1) {
        clearInterval(intervalRef.current)
        setIsRunning(false)
DingDong()  
        setMode(prev => {
          if (prev === "work") {
            console.log("tarea completada")
            setPomodoroCount(prev => prev + 1)
            setSeconds(5 * 60)
            return "break"
          } else {
            setSeconds(25 * 60)
            return "work"
          }
        })
        return s
      }
      return s - 1
    })
  }, 1000)
}

const pause = () => {
  clearInterval(intervalRef.current)
  setIsRunning(false)
}

const reset = () => {
  clearInterval (intervalRef.current)
  setIsRunning(false)
  setSeconds(25 * 60)

}

const formatTime = (s) => {
  const m = Math.floor(s/60)
  const sec = s % 60 
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

const DingDong = () => {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.value = 528
  oscillator.type= "sine"

  gainNode.gain.setValueAtTime(4, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime +5)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime +2)
}


const addTasks = () => {
  if (input.trim() === "")return
  setTask([... tasks,{id: Date.now(), text:input.trim()}])
  setInput("")
}

const removeTask = (id) => {
    setTask(tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task))
  }

  const cleanTasks = () => {
    setTask(tasks.filter(task => !task.completed))
  }

  return (
    <div>
    <header className="header">
      <h1 className="title"> pomodoro</h1>
    </header>
    <div className="wrapper">
      <div className="task-card">
        <h2 className="task-list-title">Task List</h2>
        <div className="task-input-container">
          <input
            className="task-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTasks()}
            placeholder="Add a new task"
          />
          <button className="btn-add" onClick={addTasks}>+</button>
        </div>
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                className="task-check"
                checked={task.completed || false}
                onChange={() => removeTask(task.id)}
              />
              <span style={{textDecoration: task.completed ? "line-through" : "none", opacity: task.completed ? 0.5 : 1}}>{task.text}</span>
            </li>
          ))}
        </ul>
        <button className="btn-clean" onClick={cleanTasks} style={{background: "transparent", color:"#c490a0", border: "1.5px solid #FFB7C5", borderRadius: "50px"}}>Clean</button>
      </div>

      <div className={`timer-card ${mode === "break" ? "break" : ""}`}>
        <p className="mode-label">{mode === "work" ? "🌸 tiempo de enfoque" : "☕ tiempo de descanso"}</p>
        <p className="current-task">{tasks[0]?.text ?? "sin tarea"}</p>
        <p className="timer">{formatTime(seconds)}</p>    
        <div className="controls">
          <button className="btn" onClick={start}>Start</button>
          <button className="btn" onClick={pause}>Pause</button>
          <button className="btn btn-ghost" onClick={reset}>Reset</button>
          <div className="flowers">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{fontSize:"1.5rem", opacity: i < pomodoroCount % 4 ? 1 : 0.2}}>🌸</span>
           ) )}
          </div>
         
        </div>
      </div>
       <img src={mascot} alt="mascota" className="mascota" style={{width: "150px", height: "150px", objectFit: "contain", position: "absolute", bottom: "10rem", right: "8rem"}}/>
    </div>
  </div>

  )

 
}
export default App