import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  OffcanvasTitle,
  Button,
} from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/");
      }
    });
  };

  const toggleOffcanvas = () => setShow(!show);

  return (
    <div className="container-fluid">
      <Button variant="primary" onClick={toggleOffcanvas} className="mt-3">
        <FaBars />
      </Button>
      <Offcanvas show={show} onHide={toggleOffcanvas}>
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>Quản lý nhân sự Page</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
          <ul
            className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <li className="w-100">
              <Link
                to="/dashboard"
                className="nav-link text-dark px-0 align-middle"
                onClick={toggleOffcanvas}
              >
                <i className="fs-4 bi-speedometer2 ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Dashboard</span>
              </Link>
            </li>
            <li className="w-100">
              <Link
                to="/dashboard/employee"
                className="nav-link px-0 align-middle text-dark"
                onClick={toggleOffcanvas}
              >
                <i className="fs-4 bi-people ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">
                  Quản lý nhân viên
                </span>
              </Link>
            </li>
            <li className="w-100">
              <Link
                to="/dashboard/category"
                className="nav-link px-0 align-middle text-dark"
                onClick={toggleOffcanvas}
              >
                <i className="fs-4 bi-columns ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Các vị trí</span>
              </Link>
            </li>
            <li className="w-100">
              <Link
                to="/dashboard/profile"
                className="nav-link px-0 align-middle text-dark"
                onClick={toggleOffcanvas}
              >
                <i className="fs-4 bi-person ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Profile</span>
              </Link>
            </li>
            <li className="w-100" onClick={handleLogout}>
              <Link
                className="nav-link px-0 align-middle text-dark"
                onClick={toggleOffcanvas}
              >
                <i className="fs-4 bi-power ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Đăng xuất</span>
              </Link>
            </li>
          </ul>
        </OffcanvasBody>
      </Offcanvas>
      <div className="row flex-nowrap">
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Hệ thống quản lý nhân viên</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
