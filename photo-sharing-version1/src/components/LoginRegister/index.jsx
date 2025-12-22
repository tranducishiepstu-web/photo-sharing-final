import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "https://4ck2j9-8081.csb.app";

function LoginRegister({ onLogin, mode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ===== LOGIN STATE =====
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //  info message (ví dụ: register xong quay về login)
  const [info, setInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // ngăn reload

    if (!loginName.trim()) {
      setError("Please enter login name");
      return;
    }
    if (!password.trim()) {
      setError("Please enter password");
      return;
    }

    try {
      setError("");

      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // báo server biết body là json
        body: JSON.stringify({ login_name: loginName, password }), // biến ob thành jsson để gửi
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) setError("Invalid login name or password");
        else setError("Server error");
        return;
      }

      const user = await res.json();
      if (onLogin) onLogin(user);

      navigate(`/users/${user._id}`);
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server");
    }
  };

  // ===== REGISTER STATE =====
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

  const handleRegister = async () => {
    setRegError("");
    setRegSuccess("");

    if (!regLoginName.trim()) return setRegError("login_name is required");
    if (!regFirstName.trim()) return setRegError("first_name is required");
    if (!regLastName.trim()) return setRegError("last_name is required");
    if (!regPassword.trim()) return setRegError("password is required");
    if (regPassword !== regPassword2)
      return setRegError("Passwords do not match");

    try {
      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (!res.ok) {
        let msg = "Register failed";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (e) {}
        setRegError(msg);
        return;
      }

      const data = await res.json();
      setRegSuccess(`Registered successfully: ${data.login_name}`);

      // Clear form
      setRegLoginName("");
      setRegPassword("");
      setRegPassword2("");
      setRegFirstName("");
      setRegLastName("");
      setRegLocation("");
      setRegDescription("");
      setRegOccupation("");

      // quay lại login sau khi register thành công
      navigate("/", { state: { registered: data.login_name } });
    } catch (err) {
      console.error("Register error:", err);
      setRegError("Cannot connect to server");
    }
  };

  // ===== UI theo mode =====
  if (mode === "register") {
    return (
      <div>
        <h2>Register</h2>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <label>
            Login name:
            <br />
            <input
              type="text"
              value={regLoginName}
              onChange={(e) => setRegLoginName(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            First name:
            <br />
            <input
              type="text"
              value={regFirstName}
              onChange={(e) => setRegFirstName(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Password:
            <br />
            <input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Last name:
            <br />
            <input
              type="text"
              value={regLastName}
              onChange={(e) => setRegLastName(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Confirm password:
            <br />
            <input
              type="password"
              value={regPassword2}
              onChange={(e) => setRegPassword2(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Location:
            <br />
            <input
              type="text"
              value={regLocation}
              onChange={(e) => setRegLocation(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Occupation:
            <br />
            <input
              type="text"
              value={regOccupation}
              onChange={(e) => setRegOccupation(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          {/* ô trống để cân layout (không bắt buộc) */}
          <div />

          {/* Description chiếm 2 cột */}
          <label style={{ gridColumn: "1 / -1" }}>
            Description:
            <br />
            <textarea
              rows={3}
              value={regDescription}
              onChange={(e) => setRegDescription(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={handleRegister}>
            Register Me
          </button>
          <span style={{ marginRight: 10 }} />
          <button type="button" onClick={() => navigate("/")}>
            Back
          </button>
        </div>

        {regError && <p style={{ color: "red" }}>{regError}</p>}
        {regSuccess && <p style={{ color: "green" }}>{regSuccess}</p>}
      </div>
    );
  }

  // mode === "login"
  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      {info && <p style={{ color: "green" }}>{info}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Login name:
          <br />
          <input
            type="text"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
        </label>

        <br />
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

        <span style={{ marginRight: 10 }} />

        <button type="button" onClick={() => navigate("/register")}>
          Register
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginRegister;
