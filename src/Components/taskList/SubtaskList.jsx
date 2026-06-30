// SubtaskList.jsx
// Renders the AI-generated subtasks as checkboxes under a task
// Receives subtasks as an array of strings from TaskList

function SubtaskList({ subtasks, taskIndex, onToggleSubtask }) {
  if (!subtasks || subtasks.length === 0) return null;

  return (
    <div className="subtask-list">
      <div className="subtask-label">+ AI breakdown </div>
      {subtasks.map((subtask, subIndex) => (
        <div key={subIndex} className="subtask">
          <input
            type="checkbox"
            id={`subtask-${taskIndex}-${subIndex}`}
            checked={subtask.completed}
            onChange={() => onToggleSubtask(taskIndex, subIndex)}
          />
          <label
            htmlFor={`subtask-${taskIndex}-${subIndex}`}
            style={{
              textDecoration: subtask.completed ? "line-through" : "none",
              color: subtask.completed ? "#999" : "inherit",
            }}
          >
            {subtask.text}
          </label>
        </div>
      ))}
    </div>
  );
}

export default SubtaskList;
