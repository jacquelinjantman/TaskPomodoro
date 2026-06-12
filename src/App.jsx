
import { useState, useEffect, useRef } from "react"
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
        clearInterval(intervalRef.current)
DingDong()  
setIsRunning(false)
        setMode(prev => {
          if (prev === "work") {
            setTask(t => t.slice(1))
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
    setTask(tasks.filter((tasks) => tasks.id !== id))
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
                onChange={() => removeTask(task.id)}
              />
              <span>{task.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`timer-card ${mode === "break" ? "break" : ""}`}>
        <p className="mode-label">{mode === "work" ? "🌸 tiempo de enfoque" : "☕ tiempo de descanso"}</p>
         <img src = "./mascot.gif" alt="bored gif" className="mascot"/>
        <p className="current-task">{tasks[0]?.text ?? "sin tarea"}</p>
        <p className="timer">{formatTime(seconds)}</p>    
        <div className="controls">
          <button className="btn" onClick={start}>Start</button>
          <button className="btn" onClick={pause}>Pause</button>
          <button className="btn btn-ghost" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  
  </div>

  )

 
}
export default App