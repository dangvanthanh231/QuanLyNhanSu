import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [employee, setEmployee] = useState([]);
  const [, setOrders] = useState([]); //ko cần values của Orders
  const [leaveRequestsCount, setLeaveRequestsCount] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/orders")
      .then((result) => {
        if (result.data.Status) {
          setOrders(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/orders")
      .then((result) => {
        if (result.data.Status) {
          setOrders(result.data.Result);
          // Đếm số phiếu xin nghỉ dựa trên kết quả
          const leaveRequests = {};
          result.data.Result.forEach((order) => {
            if (leaveRequests[order.employee_id]) {
              leaveRequests[order.employee_id]++;
            } else {
              leaveRequests[order.employee_id] = 1;
            }
          });
          setLeaveRequestsCount(leaveRequests);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="mt-3">
      <Link to="/dashboard/order" className="btn btn-success">
        Xem đơn
      </Link>
      <table className="table" id="customers">
        <thead>
          <tr>
            <th>Id</th>
            <th>Tên</th>
            <th>Ảnh</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Lương</th>
            <th>Số lần nộp đơn</th>
          </tr>
        </thead>
        <tbody>
          {employee.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>
                <img
                  src={`http://localhost:3000/Images/` + e.image}
                  className="employee_image"
                />
              </td>
              <td>{e.email}</td>
              <td>{e.address}</td>
              <td>{e.salary}</td>
              <td>{leaveRequestsCount[e.id] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
