import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

// 2 prop được truyền từ App.js
function TopBar({ currentUser, onLogout }) {
  // currentUser để XĐ đã login chưa -> hiển thị pls login hoặc hi
  // TopBar ko xử lý logOut, gọi onLogout để App xử lý
  const location = useLocation(); // dùng để lấy tt từ URL
  const { userId } = useParams(); // lấy ID từ URL
  const [user, setUser] = useState(null); // state lưu giá trị

  // chỉ lo fetch user trên URL để hiển thị tiêu đề bên phải
  useEffect(() => {
    if (!userId) {
      // nếu không có userID
      setUser(null);
      return;
    }

    fetchModel(`/api/user/${userId}`) // gửi req tới BE
      .then((data) => setUser(data)) // lưu state = giá trị đc BE trả về
      .catch((err) => {
        console.log(err);
        setUser(null);
      });
  }, [userId]);

  const path = location.pathname;
  let titleRight = ""; // Text hiển thị ở bên phải
  if (user) {
    if (path.startsWith("/photos/")) {
      titleRight = `Photos of ${user.first_name} ${user.last_name}`;
    } else if (path.startsWith("/users/")) {
      titleRight = `${user.first_name} ${user.last_name}`;
    }
  }

  let leftContent;
  if (currentUser) {
    // user đang login, do App truyền xuống
    leftContent = (
      <>
        <Typography variant="h5" sx={{ marginRight: 2 }}>
          Hi {currentUser.first_name}
        </Typography>
        <Button color="inherit" onClick={onLogout}>
          LOGOUT
        </Button>
      </>
    );
  } else {
    leftContent = (
      <Typography variant="h5" sx={{ marginRight: 2 }}>
        Please Login
      </Typography>
    );
  }

  return (
    // xây dựng giao diện
    // tạo thanh cố định trên cùng
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {leftContent}
        </div>
        <Typography variant="h6">{titleRight}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
