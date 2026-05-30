import { useNavigate } from "react-router-dom";
import { updateTask, deleteTask } from "../services/api";

const priorityStyles = {
  high:   "bg-red-50 text-red-600 border-red-100",
  medium: "bg-yellow-50 text-yellow-600 border-yellow-100",
  low:    "bg-green-50 text-green-600 border-green-100",
};

const TaskCard = ({ task, onRefresh }) => {
  const navigate = useNavigate();

  const handleToggleStatus = async () => {
    try {
      const newStatus = task.status === "pending" ? "completed" : "pending";
      await updateTask(task._id, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert("Could not update task status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task._id);
      onRefresh();
    } catch (err) {
      alert("Could not delete task");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    task.dueDate &&
    task.status === "pending" &&
    new Date(task.dueDate) < new Date();

  return (
    <div className={`card flex flex-col gap-3 ${task.status === "completed" ? "opacity-70" : ""}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1">
          {/* Checkbox */}
          <button
            onClick={handleToggleStatus}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              task.status === "completed"
                ? "bg-primary-600 border-primary-600"
                : "border-gray-300 hover:border-primary-400"
            }`}
          >
            {task.status === "completed" && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Title */}
          <p className={`font-medium text-gray-800 ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </p>
        </div>

        {/* Priority badge */}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 pl-8 leading-relaxed">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-8">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {isOverdue ? "Overdue · " : ""}{formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/tasks/edit/${task._id}`)}
            className="text-xs text-gray-400 hover:text-primary-600 px-2 py-1 rounded-md hover:bg-primary-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
