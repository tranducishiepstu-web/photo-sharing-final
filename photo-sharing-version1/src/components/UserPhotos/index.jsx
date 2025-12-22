import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  TextField, // ô input
  Button, // nút bấm
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const BASE_URL = "https://4ck2j9-8081.csb.app";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  // Map lưu text comment theo từng photoId
  const [commentTextByPhoto, setCommentTextByPhoto] = useState({});
  // Map lưu lỗi theo từng photoId
  const [commentErrorByPhoto, setCommentErrorByPhoto] = useState({});

  useEffect(() => {
    fetchModel(`/api/photo/${userId}`)
      .then((data) => setPhotos(data))
      .catch((err) => console.log(err));
  }, [userId]);

  // Update text đang gõ cho 1 photo cụ thể
  const handleChangeCommentText = (photoId, value) => {
    setCommentTextByPhoto((prev) => ({
      ...prev, // copy lại state cũ
      [photoId]: value,
    }));
    // Khi user bắt đầu gõ lại thì xóa lỗi cũ cho photo đó
    setCommentErrorByPhoto((prev) => ({
      ...prev,
      [photoId]: "",
    }));
  };

  // Submit comment cho 1 photo
  const handleAddComment = async (photoId) => {
    const text = (commentTextByPhoto[photoId] || "").trim();

    // check rỗng ở FE trước (UX tốt hơn)
    if (!text) {
      setCommentErrorByPhoto((prev) => ({
        ...prev,
        [photoId]: "Comment cannot be empty",
      }));
      return;
    }

    try {
      // gửi cmt lên BE
      const res = await fetch(`${BASE_URL}/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // để trình duyệt gửi cookie session đi kèm
        body: JSON.stringify({ comment: text }),
      });

      // Nếu lỗi -> đọc message server trả về
      if (!res.ok) {
        let msg = "Failed to add comment"; // message mặc định để show
        try {
          const data = await res.json(); // đọc json BE gửi về
          if (data && data.message) msg = data.message; // nếu parse được json và có message
        } catch (e) {
          // ignore parse error
        }

        setCommentErrorByPhoto((prev) => ({
          // set hiển thị lỗi
          ...prev,
          [photoId]: msg,
        }));
        return;
      }

      // Thành công: backend trả về comment mới theo shape:
      // { _id, comment, date_time, user: { _id, first_name, last_name } }
      const newComment = await res.json();

      // Cập nhật UI ngay: append comment vào đúng photo trong state photos
      setPhotos(
        (
          prevPhotos // prevP là mảng photo hiện tại (state cũ)
        ) =>
          prevPhotos.map((p) => {
            if (p._id !== photoId) return p; // dùng id xác định có phải ảnh được cmt ko
            return {
              ...p, // copy toàn bộ thuộc tính của ảnh đó
              comments: [...p.comments, newComment], // cpoy toàn bộ cmt cũ, thêm cmt mới vào cuối
            };
          })
      );

      // Clear input sau khi post thành công
      setCommentTextByPhoto((prev) => ({
        ...prev,
        [photoId]: "",
      }));
      setCommentErrorByPhoto((prev) => ({
        ...prev,
        [photoId]: "",
      }));
    } catch (err) {
      console.error("Add comment error:", err);
      setCommentErrorByPhoto((prev) => ({
        ...prev,
        [photoId]: "Cannot connect to server",
      }));
    }
  };

  if (!photos || photos.length === 0) {
    return <Typography>No photos available.</Typography>;
  }

  return (
    <div>
      {photos.map((p) => (
        <Card key={p._id} style={{ margin: "20px 0" }}>
          <CardMedia
            component="img"
            height="300"
            image={`${BASE_URL}/images/${p.file_name}`}
            alt="User"
          />

          <CardContent>
            <Typography variant="subtitle2">
              Date: {new Date(p.date_time).toLocaleString()}
            </Typography>

            <Divider style={{ margin: "10px 0" }} />

            <Typography variant="h6">Comments:</Typography>

            {p.comments.map((c) => (
              <Card key={c._id} style={{ marginTop: "10px", padding: "10px" }}>
                <Typography variant="body1">{c.comment}</Typography>
                <Typography variant="caption">
                  — {c.user.first_name} {c.user.last_name} (
                  {new Date(c.date_time).toLocaleString()})
                </Typography>
              </Card>
            ))}

            {/* Form thêm comment mới cho photo p */}
            <Divider style={{ margin: "15px 0" }} />
            <Typography variant="subtitle1">Add a comment</Typography>

            <TextField
              fullWidth // chiếm toàn bộ chiều ngang vùng chứa
              size="small" // làm input nhỏ gọn hơn
              placeholder="Write your comment..." // chữ mờ gợi ý
              value={commentTextByPhoto[p._id] || ""}
              onChange={(e) => handleChangeCommentText(p._id, e.target.value)}
              style={{ marginTop: 8 }}
            />

            {commentErrorByPhoto[p._id] ? (
              <Typography style={{ color: "red", marginTop: 6 }}>
                {commentErrorByPhoto[p._id]}
              </Typography>
            ) : null}

            <Button
              variant="contained"
              style={{ marginTop: 10 }}
              onClick={() => handleAddComment(p._id)}
            >
              Add Comment
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
