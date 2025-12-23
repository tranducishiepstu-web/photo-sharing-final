import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModel(`/api/user/${userId}`)
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("UserDetail error:", err);
        setUser(null);
      });
  }, [userId]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography>Location: {user.location}</Typography>
      <Typography>Occupation: {user.occupation}</Typography>
      {/*
        Comment nhiều dòng
        dòng 2
        dòng 3
      */}
      <Typography>Description: {user.description}</Typography>
      <br />
      <Link to={`/photos/${user._id}`}>Photos</Link>
      <br />
      <Link to={`/posts/${user._id}`}>Posts</Link>
    </div>
  );
}

export default UserDetail;
/*
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardMedia,
  CardContent,
  Divider,
  TextField,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
*/
