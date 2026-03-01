import { useState, useMemo } from 'react';
import './App.css';

interface Task {
  id: string;
  name: string;
  duration: number; // in minutes
  priority: 'High' | 'Medium' | 'Low';
}

interface ScheduledTask extends Task {
  startTime: string;
  endTime: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const addTask = () => {
    if (!taskName.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName,
      duration,
      priority,
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
  };

  const schedule = useMemo(() => {
    // Sort by priority (High > Medium > Low)
    const sorted = [...tasks].sort((a, b) => {
      const pMap = { High: 0, Medium: 1, Low: 2 };
      return pMap[a.priority] - pMap[b.priority];
    });

    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 09:00

    const scheduled: ScheduledTask[] = [];
    const breakDuration = 5; // 5 mins break between tasks

    sorted.forEach((task) => {
      const startTime = new Date(currentTime);
      currentTime.setMinutes(currentTime.getMinutes() + task.duration);
      const endTime = new Date(currentTime);

      scheduled.push({
        ...task,
        startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      currentTime.setMinutes(currentTime.getMinutes() + breakDuration);
    });

    return scheduled;
  }, [tasks]);

  return (
    <div className="container">
      <h1>智能日程管理器</h1>
      
      <div className="input-section">
        <input 
          value={taskName} 
          onChange={(e) => setTaskName(e.target.value)} 
          placeholder="今天要做什么？"
        />
        <div className="input-group">
          <label>时长 (分):</label>
          <input 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))} 
          />
        </div>
        <div className="input-group">
          <label>优先级:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            <option value="High">高</option>
            <option value="Medium">中</option>
            <option value="Low">低</option>
          </select>
        </div>
        <button onClick={addTask}>添加任务</button>
      </div>

      <div className="schedule-section">
        <h2>今日排期</h2>
        {schedule.length === 0 ? (
          <p className="empty-state">尚未安排任务，开始添加吧！</p>
        ) : (
          <div className="timeline">
            {schedule.map((task) => (
              <div key={task.id} className={`task-card priority-${task.priority.toLowerCase()}`}>
                <div className="task-time">{task.startTime} - {task.endTime}</div>
                <div className="task-info">
                  <span className="task-name">{task.name}</span>
                  <span className="task-badge">{task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
