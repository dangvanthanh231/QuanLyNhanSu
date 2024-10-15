import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [categories, setCategories] = useState([]);

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

    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  // Lấy tên của category_id
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };
  //Export thành excel ,install xlsx có 1 serverity vulnerability
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      employee.map((e) => ({
        "Mã nhân viên": e.id,
        Tên: e.name,
        "Ảnh cá nhân": e.image,
        Email: e.email,
        "Địa chỉ": e.address,
        Lương: e.salary,
        "Vị trí": getCategoryName(e.category_id),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách nhân viên");
    XLSX.writeFile(wb, "Danh_sach_nhan_vien.xlsx");
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách nhân viên</h3>
        <div>
          <Link to="/dashboard/add_employee" className="btn btn-success me-2">
            <i className="fa fa-plus"> Thêm mới nhân viên</i>
          </Link>
          <Link to="/dashboard/view_task" className="btn btn-success me-2">
           Danh sách công việc
          </Link>
          <button className="btn btn-primary" onClick={handleExport}>
            <i className="fa fa-download"> Xuất Excel</i>
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Mã nhân viên</th>
              <th>Tên</th>
              <th>Ảnh cá nhân</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Lương</th>
              <th>Vị trí</th>
              <th>Tác vụ</th>
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
                    className="img-fluid rounded-circle"
                    alt={e.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>{getCategoryName(e.category_id)}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e.id}
                    className="btn btn-info btn-sm me-2"
                  >
                    <i className="fa fa-edit"></i> Sửa đổi
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    <i className="fa fa-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
