import React, { useEffect, useState, useRef } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const BASE_URL = "https://4ck2j9-8081.csb.app";

// 2 prop được truyền từ App.js
function TopBar({ currentUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  // input file ẩn, dùng ref để bấm bằng nút MUI
  const fileInputRef = useRef(null);

  // chỉ lo fetch user trên URL để hiển thị tiêu đề bên phải
  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    fetchModel(`/api/user/${userId}`)
      .then((data) => setUser(data))
      .catch((err) => {
        console.log(err);
        setUser(null);
      });
  }, [userId]);

  const path = location.pathname;
  let titleRight = "";
  if (user) {
    if (path.startsWith("/photos/")) {
      titleRight = `Photos of ${user.first_name} ${user.last_name}`;
    } else if (path.startsWith("/users/")) {
      titleRight = `${user.first_name} ${user.last_name}`;
    }
  }

  // Bấm nút Add Photo => mở file picker
  const handleClickAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset để chọn lại cùng 1 file vẫn trigger onChange
      fileInputRef.current.click();
    }
  };

  // Khi user chọn file => upload
  const handleFileSelected = async (e) => {
    const file = e.target.files && e.target.files[0]; // lấy file được chọn
    if (!file) return;

    try {
      const formData = new FormData(); //FormData là object browser hỗ trợ tạo res dạng multipart/form-data.
      // "photo" phải trùng với upload.single("photo") ở backend
      formData.append("photo", file);

      // gửi dl tới BE
      const res = await fetch(`${BASE_URL}/photos/new`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        let msg = "Upload failed";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (err) {}
        alert(msg);
        return;
      }

      // backend trả về photo mới
      await res.json();

      // Indication + chuyển sang trang photos của currentUser để thấy ảnh mới
      alert("Photo uploaded successfully!");
      navigate(`/photos/${currentUser._id}`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Cannot connect to server");
    }
  };

  let leftContent;
  if (currentUser) {
    leftContent = (
      <>
        <Typography variant="h5" sx={{ marginRight: 2 }}>
          Hi {currentUser.first_name}
        </Typography>

        {/* Add Photo */}
        <Button color="inherit" onClick={handleClickAddPhoto}>
          ADD PHOTO
        </Button>

        <Button color="inherit" onClick={onLogout}>
          LOGOUT
        </Button>

        {/* input file ẩn */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*" // chỉ cho phép chọn file ảnh
          style={{ display: "none" }}
          onChange={handleFileSelected} // chọn file xong -> xử lý event
        />
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
