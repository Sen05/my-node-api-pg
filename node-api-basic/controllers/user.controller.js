const pool = require("../config/db");

// 1. GET - Lấy TẤT CẢ User
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.status(200).json({ status: "success", data: result.rows });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 2. GET - Lấy User THEO ID
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `User id: ${userId} không tồn tại.`,
      });
    }
    res.status(200).json({ status: "success", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. POST - Tạo mới User
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ status: "error", message: "Tên và Email là bắt buộc." });
    }

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
    );

    res.status(201).json({
      status: "success",
      message: "Tạo User thành công!",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ status: "error", message: "Email đã tồn tại." });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 4. PUT - Cập nhật User
exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `User id: ${userId} không tồn tại để cập nhật.`,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Cập nhật thành công.",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 5. DELETE - Xóa User
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `User id: ${userId} không tồn tại để xóa.`,
      });
    }

    res.status(200).json({
      status: "success",
      message: `Đã xóa User ID ${userId} thành công.`,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
