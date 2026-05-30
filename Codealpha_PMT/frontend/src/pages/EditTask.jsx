import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getTasks, updateTask } from "../services/api";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Load existing task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await getTasks();
        const task = data.find((t) => t._id === id);

        if (!task) {
          navigate("/tasks");
          return;
        }

        setForm({
          title: task.title,
          description: task.description || "",
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          priority: task.priority,
          status: task.status,
        });
      } catch (err) {
        setError("Failed to load task");
      } finally {
        setFetching(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateTask(id, form);
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/tasks" className="hover:text-primary-600">Tasks</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Edit Task</span>
      </div>

      <div className="card">
        <h1 className="text-lg font-bold text-gray-800 mb-5">Edit Task</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-field resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/tasks" className="btn-secondary text-center flex-1">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
