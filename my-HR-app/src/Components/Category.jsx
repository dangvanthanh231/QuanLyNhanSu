import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Category.css"; // Import file CSS tùy chỉnh

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category_with_count")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Cấu hình dữ liệu cho biểu đồ
  const data = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: categories.map((category) => category.quantity),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Các vị trí</h3>
        <Link to="/dashboard/add_category" className="btn btn-success">
          <i className="fa fa-plus"> Thêm vị trí mới</i>
        </Link>
      </div>
      <div className="table-responsive mb-3">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Tên</th>
              <th>Số lượng nhân viên</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="category-row">
                <td className="category-name">{category.name}</td>
                <td className="category-quantity">{category.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Bar data={data} />
      </div>
    </div>
  );
};

export default Category;
