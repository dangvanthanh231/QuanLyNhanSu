import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/employee/orders/${id}`
        );
        if (result.data.Status) {
          const formattedOrders = result.data.Result.map((order) => ({
            ...order,
            created_at: moment(order.created_at).format("DD/MM/YYYY HH:mm"),
          }));
          setOrders(formattedOrders);
        } else {
          console.error(result.data.Error);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn:", err);
      }
    };
    fetchOrders();
  }, [id]);

  const handleBack = () => {
    navigate(`/e_detail/${id}`);
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Đồng ý":
        return { color: "green" };
      case "Không đồng ý":
        return { color: "red" };
      default:
        return { color: "blue" };
    }
  };
  return (
    <div className="container mt-3">
      <h3>Danh sách đơn phiếu</h3>
      <table className="table" id="customers">
        <thead>
          <tr>
            <th>Loại đơn</th>
            <th>Chi tiết</th>
            <th>Ngày làm đơn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((e) => (
            <tr key={e.id}>
              <td>{e.order_type}</td>
              <td>{e.details}</td>
              <td>{e.created_at}</td>
              <td style={getStatusStyle(e.status)}>{e.status}</td>
            </tr>
          ))}
        </tbody>
        <button
          className="btn btn-secondary float-right mb-3"
          onClick={handleBack}
        >
          Quay lại
        </button>
      </table>
    </div>
  );
};

export default EmployeeOrders;
