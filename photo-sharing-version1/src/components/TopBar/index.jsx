import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function TopBar({ currentUser, onLogout }) {
  const location = useLocation();
  const { userId } = useParams();
  const [user, setUser] = useState(null);

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

  let leftContent;
  if (currentUser) {
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
