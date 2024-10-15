import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UploadFile = () => {
  const { taskId, id } = useParams(); // This receives both taskId and employeeId from the URL
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    axios
      .post(`http://localhost:3000/employee/upload/${taskId}`, formData)
      .then((result) => {
        if (result.data.Status) {
          alert("File uploaded successfully");
          navigate(`/employee_tasks/${id}`); // Navigate back to EmployeeTasks with the employeeId
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
        <h3 className="text-center">Upload File to Complete Task</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="fileInput">
              Select File
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="fileInput"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
