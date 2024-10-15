import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

router.get('/category', (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/add_category', (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  con.query(sql, [req.body.category], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});
//upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage
});

router.post('/add_employee', upload.single('image'), (req, res) => {
  const sql = `INSERT INTO employee 
    (name, email, password, address, salary, image, category_id) 
    VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id
    ];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
    });
  });
});

router.get('/employee', (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/edit_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee 
    SET name = ?, email = ?, salary = ?, address = ?, category_id = ? 
    WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/admin_count', (req, res) => {
  const sql = "SELECT count(id) as admin FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/employee_count', (req, res) => {
  const sql = "SELECT count(id) as employee FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/salary_count', (req, res) => {
  const sql = "SELECT sum(salary) as salaryOFEmp FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/admin_records', (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/category_with_count', (req, res) => {
  const sql = `
    SELECT category.id, category.name, COUNT(employee.id) as quantity
    FROM category
    LEFT JOIN employee ON category.id = employee.category_id
    GROUP BY category.id, category.name
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});
//api của todo list

// router.get('/todo_progress', (req, res) => {
//   const categoryCountQuery = "SELECT COUNT(*) as categoriesAdded FROM category";
//   const employeeCountQuery = "SELECT COUNT(*) as employeesAdded FROM employee";
//   const targetQuery = "SELECT category_target, employee_target FROM targets ORDER BY id DESC LIMIT 1";

//   const progress = {};

//   con.query(categoryCountQuery, (err, categoryResult) => {
//     if (err) return res.json({ Status: false, Error: "Query Error" });
//     progress.categoriesAdded = categoryResult[0].categoriesAdded;

//     con.query(employeeCountQuery, (err, employeeResult) => {
//       if (err) return res.json({ Status: false, Error: "Query Error" });
//       progress.employeesAdded = employeeResult[0].employeesAdded;

//       con.query(targetQuery, (err, targetResult) => {
//         if (err) return res.json({ Status: false, Error: "Query Error" });
//         if (targetResult.length > 0) {
//           progress.categoryTarget = targetResult[0].category_target;
//           progress.employeeTarget = targetResult[0].employee_target;
//         } else {
//           progress.categoryTarget = 0;
//           progress.employeeTarget = 0;
//         }
//         return res.json({ Status: true, Result: progress });
//       });
//     });
//   });
// });

// router.post('/update_targets', (req, res) => {
//   const { categoryTarget, employeeTarget } = req.body;
//   const sql = "INSERT INTO targets (category_target, employee_target) VALUES (?, ?)";
//   con.query(sql, [categoryTarget, employeeTarget], (err, result) => {
//     if (err) return res.json({ Status: false, Error: "Query Error" });
//     return res.json({ Status: true });
//   });
// });

router.get('/todo_progress', (req, res) => {
  const targetQuery = `
    SELECT category_target, employee_target, categories_added, employees_added, category_status, employee_status 
    FROM targets ORDER BY id DESC LIMIT 1`;

  const categoryCountQuery = "SELECT COUNT(id) as categoryCount FROM category";
  const employeeCountQuery = "SELECT COUNT(id) as employeeCount FROM employee";
//các query lồng nhau vì phải thực hiện hết query thì mới update 1 lần 
  con.query(targetQuery, (err, targetResult) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });

    con.query(categoryCountQuery, (err, categoryCountResult) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });

      con.query(employeeCountQuery, (err, employeeCountResult) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });

        if (targetResult.length > 0) {
          const progress = targetResult[0];
          progress.categories_added = categoryCountResult[0].categoryCount;
          progress.employees_added = employeeCountResult[0].employeeCount;

          const categoryStatus = progress.categories_added >= progress.category_target ? 'Hoàn thành' : 'Chưa hoàn thành';
          const employeeStatus = progress.employees_added >= progress.employee_target ? 'Hoàn thành' : 'Chưa hoàn thành';

          return res.json({ Status: true, Result: { ...progress, category_status: categoryStatus, employee_status: employeeStatus } });
        } else {
          return res.json({ Status: true, Result: { category_target: 0, employee_target: 0, categories_added: categoryCountResult[0].categoryCount, employees_added: employeeCountResult[0].employeeCount, category_status: 'Chưa hoàn thành', employee_status: 'Chưa hoàn thành' } });
        }
      });
    });
  });
});

router.post('/update_targets', (req, res) => {
  const { categoryTarget, employeeTarget} = req.body;
  const sql = `
    INSERT INTO targets (category_target, employee_target)
    VALUES (?, ?)`;
  con.query(sql, [categoryTarget, employeeTarget], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});





//order
router.get('/orders', (req, res) => {
  const sql = "SELECT * FROM orders";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});
router.put('/update_order_status/:id', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  con.query(sql, [status, id], (err) => {
      if (err) return res.json({Status: false, Error: "Query Error" + err});
      return res.json({Status: true});
  });
});
router.get('/leaveDays_count', (req, res) => {
  const sql = "SELECT employee_id, COUNT(id) AS leave_requests FROM orders WHERE order_type = 'Đơn xin nghỉ' GROUP BY employee_id;";
  con.query(sql, (err, result) => {
      if(err) {
          return res.json({ Status: false, Error: "Query Error"+err })         
      }
      return res.json({ Status: true, Result: result})
  })
})


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});


//task 
router.post('/add_task', (req, res) => {
  const { employee_id, task_name, task_description, due_date } = req.body;
  const sql = "INSERT INTO tasks (employee_id, task_name, task_description, due_date) VALUES (?, ?, ?, ?)";

  con.query(sql, [employee_id, task_name, task_description, due_date], (err, result) => {
    if (err) {
      console.error('Error inserting task:', err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true });
  });
});

router.put('/update_task_status/:id', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const sql = "UPDATE tasks SET status = ? WHERE id = ?";
  con.query(sql, [status, id], (err, result) => {
      if (err) {
          return res.json({ Status: false, Error: "Query Error: " + err });
      }
      return res.json({ Status: true });
  });
});

// API to get all tasks with uploaded files
router.get('/tasks_with_files', (req, res) => {
  const sql = 'SELECT * FROM tasks WHERE file_path IS NOT NULL';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/rate_task/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const rating = req.body.rating;

  // Kiểm tra xem công việc đã được đánh giá chưa
  const checkSql = 'SELECT rating FROM tasks WHERE id = ?';
  con.query(checkSql, [taskId], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Lỗi truy vấn: " + err });
    if (result.length > 0 && result[0].rating !== null) {
      return res.json({ Status: false, Error: "Công việc đã được đánh giá" });
    }

    // Cập nhật công việc với đánh giá mới
    const sql = 'UPDATE tasks SET rating = ? WHERE id = ?';
    con.query(sql, [rating, taskId], (err) => {
      if (err) return res.json({ Status: false, Error: "Lỗi truy vấn: " + err });
      return res.json({ Status: true });
    });
  });
});

export { router as adminRouter };
