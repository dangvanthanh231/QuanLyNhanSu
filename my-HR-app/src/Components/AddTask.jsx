import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [task, setTask] = useState({
    employee_id: "",
    task_name: "",
    task_description: "",
    due_date: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:3000/auth/add_task", task)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/tasks");
        } else {
          alert(result.data.Error.message || JSON.stringify(result.data.Error));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert(err.message || JSON.stringify(err));
        setLoading(false);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Task</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="employee" className="form-label">
              Employee
            </label>
            <select
              name="employee"
              id="employee"
              className="form-select"
              value={task.employee_id}
              onChange={({ target: { value } }) =>
                setTask({ ...task, employee_id: value })
              }
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="taskName" className="form-label">
              Task Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="taskName"
              placeholder="Enter Task Name"
              value={task.task_name}
              onChange={({ target: { value } }) =>
                setTask({ ...task, task_name: value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="taskDescription" className="form-label">
              Task Description
            </label>
            <textarea
              className="form-control rounded-0"
              id="taskDescription"
              placeholder="Enter Task Description"
              value={task.task_description}
              onChange={({ target: { value } }) =>
                setTask({ ...task, task_description: value })
              }
            ></textarea>
          </div>
          <div className="col-12">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="dueDate"
              value={task.due_date}
              onChange={({ target: { value } }) =>
                setTask({ ...task, due_date: value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
