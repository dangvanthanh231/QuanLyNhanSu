import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const AdminTaskReview = () => {
  const [tasks, setTasks] = useState([]);
  const [rating, setRating] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/auth/tasks_with_files')
      .then(result => {
        if (result.data.Status) {
          setTasks(result.data.Result);
        } else {
          console.error(result.data.Error);
        }
      })
      .catch(err => console.error('Lỗi khi lấy danh sách công việc:', err));
  }, []);

  const handleRatingChange = (taskId, value) => {
    setRating({ ...rating, [taskId]: value });
  };

  const handleSubmitRating = (taskId) => {
    const taskRating = rating[taskId];
    axios.post(`http://localhost:3000/auth/rate_task/${taskId}`, { rating: taskRating })
      .then(result => {
        if (result.data.Status) {
          alert('Đánh giá thành công');
          // Cập nhật đánh giá công việc trên giao diện
          setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, rating: taskRating } : task
          ));
        } else {
          alert(result.data.Error.message || JSON.stringify(result.data.Error));
        }
      })
      .catch(err => {
        console.log(err);
        alert(err.message || JSON.stringify(err));
      });
  };

  return (
    <div className="container mt-3">
      <h3>Đánh giá các công việc đã tải lên</h3>
      <Link to="/dashboard/add_task" className="btn btn-success me-2">
        Thêm công việc
      </Link>
      <table className="table" id="customers">
        <thead>
          <tr>
            <th>Tên công việc</th>
            <th>Mô tả</th>
            <th>Ngày đến hạn</th>
            <th>File đã tải lên</th>
            <th>Đánh giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.task_name}</td>
              <td>{task.task_description}</td>
              <td>{task.due_date}</td>
              <td>
                <a href={`http://localhost:3000/${task.file_path}`} target="_blank" rel="noopener noreferrer">
                  Xem file
                </a>
              </td>
              <td>
                {task.rating !== null ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={task.rating}
                    readOnly
                  />
                ) : (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating[task.id] || ''}
                    onChange={(e) => handleRatingChange(task.id, e.target.value)}
                  />
                )}
              </td>
              <td>
                {task.rating !== null ? (
                  <button className="btn btn-secondary" disabled>Đã đánh giá</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => handleSubmitRating(task.id)}>Gửi đánh giá</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTaskReview;
