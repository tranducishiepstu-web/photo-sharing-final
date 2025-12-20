// hiển thị form Login
// nhận login_name ng dùng gõ
// Gửi request POST /admin/login lên backend.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://k4dcrq-8081.csb.app";
// onLogin chính là handleLoginSuccess được App truyền xuống.
function LoginRegister({ onLogin }) {
  // giá trị và hàm set giá trị cho Đăng Nhập
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // giá trị và hàm cho Đăng Ký
  const [regLoginName, setRegLoginName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regDescription, setRegDescription] = useState("");
  const [regOccupation, setRegOccupation] = useState("");

  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  /////
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // hàm để xử lý sự kiện bấm vào nút Login
    e.preventDefault(); // ngăn reload lại trang

    if (!loginName.trim()) {
      // nếu rỗng
      setError("Please enter login name");
      return;
    }
    if (!password.trim()) {
      setError("Please enter password");
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
        // gửi những dữ liệu này tới BE
        body: JSON.stringify({ login_name: loginName, password }),
        credentials: "include", // rất quan trọng để BE set session
      });

      if (!res.ok) {
        if (res.status === 400) {
          setError("Invalid login name or password");
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
  // hàm xử lý Đăng Ký
  const handleRegister = async () => {
    // xóa thông báo cũ
    setRegError("");
    setRegSuccess("");
    // các trường cần nhập
    if (!regLoginName.trim()) {
      setRegError("login_name is required");
      return;
    }
    if (!regFirstName.trim()) {
      setRegError("first_name is required");
      return;
    }
    if (!regLastName.trim()) {
      setRegError("last_name is required");
      return;
    }
    if (!regPassword.trim()) {
      setRegError("password is required");
      return;
    }
    if (regPassword !== regPassword2) {
      setRegError("Passwords do not match");
      return;
    }
    try {
      // gửi DL tới BE
      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          login_name: regLoginName,
          password: regPassword,
          first_name: regFirstName,
          last_name: regLastName,
          location: regLocation,
          description: regDescription,
          occupation: regOccupation,
        }),
      });
      // trong TH fail
      if (!res.ok) {
        let msg = "Register failed";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (e) {}
        setRegError(msg);
        return;
      }
      // json BE gửi lại
      const data = await res.json();
      setRegSuccess(`Registered successfully: ${data.login_name}`);
      setRegError("");

      // Xóa giá trị trong ô text register
      setRegLoginName("");
      setRegPassword("");
      setRegPassword2("");
      setRegFirstName("");
      setRegLastName("");
      setRegLocation("");
      setRegDescription("");
      setRegOccupation("");
    } catch (err) {
      console.error("Register error:", err);
      setRegError("Cannot connect to server");
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
        <label>
          Password:
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Register</h2>
      <div style={{ marginTop: 10 }}>
        <label>
          Login name:
          <br />
          <input
            type="text"
            value={regLoginName}
            onChange={(e) => setRegLoginName(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          Password:
          <br />
          <input
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          Confirm password:
          <br />
          <input
            type="password"
            value={regPassword2}
            onChange={(e) => setRegPassword2(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          First name:
          <br />
          <input
            type="text"
            value={regFirstName}
            onChange={(e) => setRegFirstName(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          Last name:
          <br />
          <input
            type="text"
            value={regLastName}
            onChange={(e) => setRegLastName(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          Location:
          <br />
          <input
            type="text"
            value={regLocation}
            onChange={(e) => setRegLocation(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          Occupation:
          <br />
          <input
            type="text"
            value={regOccupation}
            onChange={(e) => setRegOccupation(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          Description:
          <br />
          <textarea
            rows={3}
            value={regDescription}
            onChange={(e) => setRegDescription(e.target.value)}
          />
        </label>

        <br />
        <br />

        <button type="button" onClick={handleRegister}>
          Register Me
        </button>

        {regError && <p style={{ color: "red" }}>{regError}</p>}
        {regSuccess && <p style={{ color: "green" }}>{regSuccess}</p>}
      </div>
    </div>
  );
}

export default LoginRegister;
