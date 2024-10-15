import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Employee from "./Components/Employee";
import Category from "./Components/Category";
import Profile from "./Components/Profile";
import AddCategory from "./Components/AddCategory";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import Start from "./Components/Start";
import EmployeeDetail from "./Components/EmployeeDetail";
import PrivateRoute from "./Components/PrivateRoute";
import CreateOrder from "./Components/CreateOrder";
import EmployeeOrders from "./Components/EmployeeOrders";
import AdminOrders from "./Components/AdminOrders";
import AddTask from "./Components/AddTask";
import EmployeeTasks from "./Components/EmployeeTasks";
import UploadFile from "./Components/UploadFile";
import AdminTaskReview from "./Components/AdminTaskReview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/e_detail/:id" element={<EmployeeDetail />}></Route>
        <Route path="/create-order/:id/:orderType" element={<CreateOrder />} />
        <Route path="/employee-orders/:id" element={<EmployeeOrders />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
        <Route path="/employee_tasks/:id" element={<EmployeeTasks />} />
        <Route path="/upload/:taskId/:id" element={<UploadFile />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="" element={<Home />}></Route>
          <Route path="/dashboard/employee" element={<Employee />}></Route>
          <Route path="/dashboard/category" element={<Category />}></Route>
          <Route path="/dashboard/profile" element={<Profile />}></Route>
          <Route path="/dashboard/order" element={<AdminOrders />} />
          <Route path="/dashboard/add_category" element={<AddCategory />}></Route>
          <Route path="/dashboard/add_employee" element={<AddEmployee />}></Route>
          <Route path="/dashboard/edit_employee/:id" element={<EditEmployee />}></Route>
          <Route path="/dashboard/add_task" element={<AddTask />}></Route>
          <Route path="/dashboard/view_task" element={<AdminTaskReview />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
