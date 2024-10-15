import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from 'multer';//thêm phần phân công

const router = express.Router()

//api đăng nhập 
router.post("/employee_login", (req, res) => {
    const sql = "SELECT * from employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password, (err, response) => {
            if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
            if(response) {
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "employee", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token)
                return res.json({ loginStatus: true, id: result[0].id });
            }
        })
        
      } else {
          return res.json({ loginStatus: false, Error:"wrong email or password" });
      }
    });
  });

  //api thông tin employee
  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
  })

  // api đăng xuất
  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })
  //api lấy thông tin employee khi vừa đăng nhập employee thành công
  router.get('/', (req, res) => {
    const decoded = jwt.verify(req.cookies.token, "jwt_secret_key"); // Xác minh token
    const loggedInUserId = decoded.id;
  
    const sql = `SELECT id, name FROM employee WHERE id != ?`; // Loại trừ người dùng đang đăng nhập
  
    con.query(sql, [loggedInUserId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Query error' });
      return res.json({ Result: result });
    });
  });

  // API to send a message
router.post('/send_message', (req, res) => {
  const sql = `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?)`;
  if(err) return res.json({Status: false, Error: "Query Error"})
  const values =[
    req.body.sender_id,
    req.body.receiver_id,
    req.body.message
  ]
  con.query(sql, [values], (err, result) => {
      if (err) return res.json({ status: false, error: err });
      return res.json({ status: true, messageId: result.values});
  });
});

// API to get messages for a user
router.get('/messages/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT m.*, e1.name AS sender_name, e2.name AS receiver_name
    FROM messages m
    INNER JOIN employee e1 ON m.sender_id = e1.id
    INNER JOIN employee e2 ON m.receiver_id = e2.id
    WHERE m.sender_id = ? OR m.receiver_id = ?
    ORDER BY m.timestamp DESC
  `;
  con.query(sql, [userId, userId], (err, results) => {
    if (err) return res.json({ status: false, error: err });
    return res.json({ status: true, messages: results });
  });
});

router.post('/add_order', (req, res) => {
  const { employee_id, order_type, details } = req.body;
  const sql = `INSERT INTO orders (employee_id, order_type, details, status) VALUES (?, ?, ?, 'Chờ...')`;
  const values = [employee_id, order_type, details];
  con.query(sql, values, (err) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
  });
});

router.get('/orders/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM orders WHERE employee_id = ?";
  con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
  });
});

//task
router.get('/employee_tasks/:employee_id', (req, res) => {
  const employee_id = req.params.employee_id;
  const sql = "SELECT * FROM tasks WHERE employee_id = ?";
  con.query(sql, [employee_id], (err, result) => {
      if (err) {
          return res.json({ Status: false, Error: "Query Error: " + err });
      }
      return res.json({ Status: true, Result: result });
  });
});

// Cấu hình multer cho việc lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Định nghĩa route cho tải lên file và cập nhật trạng thái task
router.post('/upload/:taskId', upload.single('file'), (req, res) => {
  const { taskId } = req.params;
  const file = req.file;

  if (!file) {
    return res.json({ Status: false, Error: "No file uploaded" });
  }

  const sql = "UPDATE tasks SET status = 'Hoàn thành', file_path = ? WHERE id = ?";

  con.query(sql, [file.path, taskId], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true });
  });
});


  export {router as EmployeeRouter}