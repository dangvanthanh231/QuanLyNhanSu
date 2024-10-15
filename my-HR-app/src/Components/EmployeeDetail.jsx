import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap";
import { AiOutlineCaretDown } from "react-icons/ai";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/employee/detail/${id}`
        );
        setEmployee(result.data[0]);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin nhân viên:", err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleLogout = async () => {
    try {
      const result = await axios.get("http://localhost:3000/employee/logout");
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/");
      }
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  const navigateToOrder = (orderType) => {
    navigate(`/create-order/${id}/${orderType}`);
  };

  const navigateToOrders = () => {
    navigate(`/employee-orders/${id}`);
  };

  const navigateToTasks = () => {
    navigate(`/employee_tasks/${id}`);
  };

  if (!employee) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="p-2 d-flex justify-content-center shadow">
        <h4>Hệ thống quản lý nhân viên</h4>
      </div>
      <div className="dropdown mt-3">
        <button
          className="btn btn-secondary"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Tạo đơn
          <AiOutlineCaretDown className="ml-2" />
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <button
            className="dropdown-item"
            onClick={() => navigateToOrder("xin nghỉ")}
          >
            Đơn xin nghỉ
          </button>
          <button
            className="dropdown-item"
            onClick={() => navigateToOrder("đề nghị làm thêm")}
          >
            Đề nghị làm thêm
          </button>
          <button
            className="dropdown-item"
            onClick={() => navigateToOrder("đề nghị đổi ca")}
          >
            Đề nghị đổi ca
          </button>
          <button
            className="dropdown-item"
            onClick={() => navigateToOrder("đề nghị công tác")}
          >
            Đề nghị công tác
          </button>
        </div>
      </div>
      <button className="btn btn-primary mt-2" onClick={navigateToOrders}>
        Xem đơn đã tạo
      </button><br/>
      <button className="btn btn-info mt-2" onClick={navigateToTasks}>
        Xem danh sách công việc
      </button>
      <div className="d-flex justify-content-center flex-column align-items-center mt-3">
        <img
          src={`http://localhost:3000/Images/${employee.image}`}
          alt={`Ảnh của ${employee.name}`}
          className="emp_det_image"
        />
        <div className="d-flex align-items-center flex-column mt-5">
          <h3>Tên: {employee.name}</h3>
          <h3>Email: {employee.email}</h3>
          <h3>Lương: ${employee.salary}</h3>
        </div>
        <div>
          <button className="btn btn-danger" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
