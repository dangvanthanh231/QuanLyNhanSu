import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateOrder = () => {
  const [details, setDetails] = useState("");
  const { id, orderType } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:3000/employee/add_order",
        {
          employee_id: id,
          order_type: orderType,
          details: details,
        }
      );
      if (result.data.Status) {
        navigate(`/e_detail/${id}`); // Điều hướng về trang chi tiết nhân viên
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.error("Lỗi khi thêm đơn phiếu:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-3 rounded border" style={{ width: "50%" }}>
        <h3 className="text-center">Tạo đơn phiếu mới ({orderType})</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chi tiết</label>
            <textarea
              className="form-control rounded-0"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success  rounded-0 mb-2">
            Thêm đơn
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
