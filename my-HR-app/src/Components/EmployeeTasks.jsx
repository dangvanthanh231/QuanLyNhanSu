import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmployeeTasks = () => {
    const [tasks, setTasks] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/employee/employee_tasks/${id}`)
            .then(result => {
                if (result.data.Status) {
                    setTasks(result.data.Result);
                } else {
                    console.error(result.data.Error);
                }
            })
            .catch(err => console.error('Error fetching tasks:', err));
    }, [id]);

    const handleBack = () => {
        navigate(`/e_detail/${id}`);
    };

    const handleUpload = (taskId) => {
        navigate(`/upload/${taskId}/${id}`);
    };

    return (
        <div className="container mt-3">
            <h3>Tasks for Employee {id}</h3>
            <table className="table" id="customers">
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Báo cáo công việc</th>
                        <th>Status</th>
                        <th>Đánh giá hoàn thành</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.task_name}</td>
                            <td>{task.task_description}</td>
                            <td>{task.due_date}</td>
                            <td>
                                {task.status === 'Hoàn thành' ? (
                                    'Completed'
                                ) : (
                                    <button className="btn btn-primary" onClick={() => handleUpload(task.id)}>Upload File</button>
                                )}
                            </td>
                            <td>{task.status}</td>
                            <td>{task.rating}/10</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-secondary mb-3 float-right" onClick={handleBack}>Back</button>
        </div>
    );
};

export default EmployeeTasks;
