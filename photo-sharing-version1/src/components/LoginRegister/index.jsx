// hiển thị form Login
// nhận login_name ng dùng gõ
// Gửi request POST /admin/login lên backend.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://k4dcrq-8081.csb.app";
// onLogin chính là handleLoginSuccess được App truyền xuống.
function LoginRegister({ onLogin }) {
  // giá trị và hàm set giá trị
  const [loginName, setLoginName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // hàm để xử lý sự kiện bấm vào nút Login
    e.preventDefault(); // ngăn reload lại trang

    if (!loginName.trim()) {
      // nếu rỗng
      setError("Please enter login name");
      return;
    }

    try {
      setError(""); // xóa lỗi cũ trước khi gửi req mới

      const res = await fetch(`${BASE_URL}/admin/login`, {
        // gửi req tới BE
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login_name: loginName }),
        credentials: "include", // rất quan trọng để BE set session
      });

      if (!res.ok) {
        if (res.status === 400) {
          setError("Invalid login name");
        } else {
          setError("Server error");
        }
        return;
      }

      const user = await res.json(); // nhận json được BE gửi

      if (onLogin) {
        // tương đương setCurrentUser(user);
        onLogin(user);
      }

      navigate(`/users/${user._id}`); // login thành công -> chuyển tới URL này
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server");
    }
  };

  return (
    // Xây dựng giao diện
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Login name:
          <br />
          <input
            type="text"
            value={loginName} // giá trị hiển thị trong ô lấy từ state
            onChange={(e) => setLoginName(e.target.value)} // cập nhật state
          />
        </label>
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <hr />
      <h3>Register (Problem 4)</h3>
      <p>Phần register sẽ triển khai sau.</p>
    </div>
  );
}

export default LoginRegister;
