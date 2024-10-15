import axios from "axios";
import { useEffect, useState } from "react";
import { Table, ProgressBar, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);

  const [categoryTarget, setCategoryTarget] = useState(0);
  const [employeeTarget, setEmployeeTarget] = useState(0);
  const [categoriesAdded, setCategoriesAdded] = useState(0);
  const [employeesAdded, setEmployeesAdded] = useState(0);
  const [categoryStatus, setCategoryStatus] = useState("Chưa hoàn thành");
  const [employeeStatus, setEmployeeStatus] = useState("Chưa hoàn thành");

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    fetchToDoProgress();
  }, []);

  const adminCount = () => {
    axios.get("http://localhost:3000/auth/admin_count").then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const employeeCount = () => {
    axios.get("http://localhost:3000/auth/employee_count").then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const salaryCount = () => {
    axios.get("http://localhost:3000/auth/salary_count").then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOFEmp);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const fetchToDoProgress = () => {
    axios.get("http://localhost:3000/auth/todo_progress").then((result) => {
      if (result.data.Status) {
        setCategoryTarget(result.data.Result.category_target);
        setEmployeeTarget(result.data.Result.employee_target);
        setCategoriesAdded(result.data.Result.categories_added);
        setEmployeesAdded(result.data.Result.employees_added);
        setCategoryStatus(result.data.Result.category_status);
        setEmployeeStatus(result.data.Result.employee_status);
      }
    });
  };
  //lưu dữ liệu của target vào database, dữ liệu của tiến độ và trạng thái k lưu vào database,cập nhật trên web dựa theo target
  const updateTargets = () => {
    axios
      .post("http://localhost:3000/auth/update_targets", {
        categoryTarget,
        employeeTarget,
      })
      .then((result) => {
        if (result.data.Status) {
          alert("Cập nhật thành công");
          fetchToDoProgress();
        } else {
          alert(result.data.Error);
        }
      });
  };
  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Quản trị viên</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Nhân viên</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Tổng:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Lương</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Tổng:</h5>
            <h5>${salaryTotal}</h5>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <h4>Chỉ tiêu yêu cầu</h4>
        <Form>
          <Form.Group>
            <Form.Label>Vị trí:</Form.Label>
            <Form.Control
              type="number"
              value={categoryTarget}
              onChange={(e) => setCategoryTarget(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nhân viên:</Form.Label>
            <Form.Control
              type="number"
              value={employeeTarget}
              onChange={(e) => setEmployeeTarget(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={updateTargets}>
            Cập nhật Targets
          </Button>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Chỉ tiêu</th>
              <th>Tiến độ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Đạt tổng {categoryTarget} vị trí trong Công Ty</td>
              <td>
                <ProgressBar
                  now={(categoriesAdded / categoryTarget) * 100}
                  label={`${categoriesAdded}/${categoryTarget}`}
                />
              </td>
              <td>
                {categoryStatus === "Hoàn thành" ? (
                  <span className="text-success">Hoàn thành</span>
                ) : (
                  <span className="text-danger">Chưa hoàn thành</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Đạt tổng {employeeTarget} nhân viên</td>
              <td>
                <ProgressBar
                  now={(employeesAdded / employeeTarget) * 100}
                  label={`${employeesAdded}/${employeeTarget}`}
                />
              </td>
              <td>
                {employeeStatus === "Hoàn thành" ? (
                  <span className="text-success">Hoàn thành</span>
                ) : (
                  <span className="text-danger">Chưa hoàn thành</span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
