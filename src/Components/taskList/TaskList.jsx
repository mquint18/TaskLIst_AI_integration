import { useState } from "react";
import Button from "../button/Button";
import Input from "./Input";
import SubtaskList from "./SubtaskList";

function TaskList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Tracks which task is currently waiting for AI response
  // null means no task is loading, a number means that task index is loading
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Error message per task — keyed by task index
  const [errors, setErrors] = useState({});

  function AddTask() {
    if (task === "") {
      alert("Please enter a task");
      return;
    }

    setTasks([
      ...tasks,
      {
        text: task,
        completed: false,
        // subtasks is now part of every task object
        // starts empty, gets filled when user clicks "Break it down"
        subtasks: [],
      },
    ]);

    setTask("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      AddTask();
    }
  }

  function toggleTask(index) {
    const updatedTasks = [...tasks];

    updatedTasks[index].completed = !updatedTasks[index].completed;

    setTasks(updatedTasks);
  }

  function deleteTask(index) {
    const updateTasks = tasks.filter((item, i) => i !== index);
    setTasks(updateTasks);
    // Clean up any error state for this task
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  }

  // Toggles a single subtask's completed state
  // taskIndex = which task, subIndex = which subtask within it
  function toggleSubtask(taskIndex, subIndex) {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks[subIndex].completed =
      !updatedTasks[taskIndex].subtasks[subIndex].completed;
    setTasks(updatedTasks);
  }

  // Calls our Express server which calls Claude
  // Gets back 5 subtasks and adds them to the task object
  async function breakdownTask(index) {
    const taskText = tasks[index].text;

    setLoadingIndex(index);

    // Clear any previous error for this task
    setErrors((prev) => ({ ...prev, [index]: null }));

    try {
      const response = await fetch("/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      // data.subtasks is an array of strings from the server
      // We convert each string into { text, completed } objects
      // so they work with our toggleSubtask function
      const updatedTasks = [...tasks];
      updatedTasks[index].subtasks = data.subtasks.map((text) => ({
        text,
        completed: false,
      }));
      setTasks(updatedTasks);
    } catch (err) {
      setErrors((prev) => ({ ...prev, [index]: err.message }));
    } finally {
      setLoadingIndex(null);
    }
  }

  return (
    <div className="todolist">
      <h1>My To-Dos</h1>

      <Input
        value={task}
        placeholder="Enter New Task"
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button text="Add Task" onClick={AddTask} />

      <div className="tasklist">
        {tasks.map((item, index) => (
          <div className="task" key={index}>
            <p
              style={{
                textDecoration: item.completed ? "line-through" : "none",
              }}
            >
              {item.text}
            </p>
            <Button
              text={item.completed ? "Undo" : "Complete"}
              onClick={() => toggleTask(index)}
            />

            <Button text="Remove Task" onClick={() => deleteTask(index)} />

            {/* Break it down button — disabled while loading */}
            <Button
              text={loadingIndex === index ? "Thinking..." : "Break it down"}
              onClick={() => breakdownTask(index)}
              disabled={loadingIndex === index}
            />

            {/* Error message for this specific task */}
            {errors[index] && (
              <p style={{ color: "red", fontSize: "0.85rem" }}>
                {errors[index]}
              </p>
            )}

            {/* Subtasks appear here once Claude responds */}
            <SubtaskList
              subtasks={item.subtasks}
              taskIndex={index}
              onToggleSubtask={toggleSubtask}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default TaskList;
