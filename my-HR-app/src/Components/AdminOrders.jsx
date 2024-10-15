import axios from "axios";
import { useEffect, useState } from "react";
import "./style.css";
import moment from "moment";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get("http://localhost:3000/auth/orders");
        if (result.data.Status) {
          setOrders(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn:", err);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const result = await axios.put(
        `http://localhost:3000/auth/update_order_status/${orderId}`,
        { status }
      );
      if (result.data.Status) {
        alert("Cập nhật trạng thái thành công");
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
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
    <div className="mt-3">
      <h3>Danh sách đơn cần xử lý</h3>
      <table className="table table-bordered" id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Nhân viên</th>
            <th>Loại đơn</th>
            <th>Chi tiết</th>
            <th>Thời gian gửi</th>
            <th>Trạng thái</th>
            <th>Chấp nhận</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.id}</td>
              <td>{order.employee_id}</td>
              <td>{order.order_type}</td>
              <td>{order.details}</td>
              <td>{moment(order.created_at).format("DD-MM-YYYY HH:mm:ss")}</td>
              <td style={getStatusStyle(order.status)}>{order.status}</td>
              <td>
                <button
                  className="btn btn-success mr-2 btn-sm me-2"
                  onClick={() => updateOrderStatus(order.id, "Đồng ý")}
                >
                  Có
                </button>
                <button
                  className="btn btn-warning btn-sm "
                  onClick={() => updateOrderStatus(order.id, "Không đồng ý")}
                >
                  Không
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
