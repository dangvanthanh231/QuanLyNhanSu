import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    salary: '',
    address: '',
    category_id: '',
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndEmployee = async () => {
      try {
        const categoryResult = await axios.get('http://localhost:3000/auth/category');
        if (categoryResult.data.Status) {
          setCategory(categoryResult.data.Result);
        } else {
          alert(categoryResult.data.Error);
        }

        const employeeResult = await axios.get(`http://localhost:3000/auth/employee/${id}`);
        if (employeeResult.data.Status) {
          setEmployee({
            name: employeeResult.data.Result[0].name,
            email: employeeResult.data.Result[0].email,
            address: employeeResult.data.Result[0].address,
            salary: employeeResult.data.Result[0].salary,
            category_id: employeeResult.data.Result[0].category_id,
          });
        } else {
          alert(employeeResult.data.Error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategoriesAndEmployee();
  }, [id]); // Add 'id' and 'employee' as dependencies

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_employee/${id}`, employee)
      .then((result) => {
        if (result.data.Status) {
          navigate('/dashboard/employee');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Sửa thông tin nhân viên</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Tên
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Lương
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary}
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Địa chỉ
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.address}
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Vai trò
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={employee.category_id} // Ensure the selected value is set
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
            >
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Sửa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
