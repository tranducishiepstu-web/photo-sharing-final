import "./App.css";

import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import BlogPost from "./components/BlogPost";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
const BASE_URL = "https://mrj3rp-8081.csb.app";

// Layout chung: TopBar + (có thể) UserList + main content
const MainLayout = ({ children, currentUser, onLogout }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TopBar currentUser={currentUser} onLogout={onLogout} />
    </Grid>

    <div className="main-topbar-buffer" />

    {/* Chỉ hiển thị cột UserList khi đã đăng nhập */}
    {currentUser && (
      <Grid item sm={3}>
        <Paper className="main-grid-item">
          <UserList />
        </Paper>
      </Grid>
    )}

    {/* Nếu chưa login → main chiếm full 12 cột; nếu login → 9 cột */}
    <Grid item sm={currentUser ? 9 : 12}>
      <Paper className="main-grid-item">{children}</Paper>
    </Grid>
  </Grid>
);

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();
  // Hỏi BE xem session hiện tại có user không
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${BASE_URL}/admin/current`, {
          credentials: "include",
        });

        if (!res.ok) {
          setCurrentUser(null);
          return;
        }

        const user = await res.json();
        setCurrentUser(user);
      } catch (err) {
        console.error("checkSession error:", err);
        setCurrentUser(null);
      }
    }

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/admin/logout`, {
        // gọi post api/admin/logout
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setCurrentUser(null);
      navigate("/", { replace: true });
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            <LoginRegister mode="login" onLogin={handleLoginSuccess} />
          </MainLayout>
        }
      />
      <Route
        path="/register"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            <LoginRegister mode="register" onLogin={handleLoginSuccess} />
          </MainLayout>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            {currentUser ? (
              <UserDetail />
            ) : (
              <LoginRegister onLogin={handleLoginSuccess} />
            )}
          </MainLayout>
        }
      />
      <Route
        path="/photos/:userId"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            {currentUser ? (
              <UserPhotos currentUser={currentUser} />
            ) : (
              <LoginRegister onLogin={handleLoginSuccess} />
            )}
          </MainLayout>
        }
      />
      <Route
        path="/posts/:userId"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            {currentUser ? (
              <BlogPost />
            ) : (
              <LoginRegister onLogin={handleLoginSuccess} />
            )}
          </MainLayout>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            <EditProfile
              currentUser={currentUser}
              onProfileUpdated={setCurrentUser}
            />
          </MainLayout>
        }
      />
      <Route
        path="/change-password"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            {currentUser ? (
              <UserList />
            ) : (
              <ChangePassword onLogin={handleLoginSuccess} />
            )}
          </MainLayout>
        }
      />
      <Route
        path="/users"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            {currentUser ? (
              <UserList />
            ) : (
              <LoginRegister onLogin={handleLoginSuccess} />
            )}
          </MainLayout>
        }
      />
      <Route
        path="/"
        element={
          <MainLayout currentUser={currentUser} onLogout={handleLogout}>
            {currentUser ? (
              <UserList />
            ) : (
              <LoginRegister onLogin={handleLoginSuccess} />
            )}
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default App;
