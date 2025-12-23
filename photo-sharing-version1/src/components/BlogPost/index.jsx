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
const BASE_URL = "https://mrj3rp-8081.csb.app";
function BlogPost() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]); // hien thi blogpost

  useEffect(() => {
    fetchModel(`/api/post/${userId}`)
      .then((data) => setPosts(data))
      .catch((err) => console.log(err));
  }, [userId]);
  if (!posts || posts.length === 0) {
    return <Typography>No blog post avaiable</Typography>;
  }
  return (
    <div>
      {posts.map((p) => (
        <div key={p._id} style={{ marginBottom: 16 }}>
          <Typography variant="h4">Title: {p.title}</Typography>
          <Typography>Content: {p.content}</Typography>
          <Divider style={{ margin: "10px 0" }} />
        </div>
      ))}
    </div>
  );
}
export default BlogPost;
