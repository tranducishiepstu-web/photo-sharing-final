import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

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

const BASE_URL = "https://mrj3rp-8081.csb.app";

function UserPhotos({ currentUser }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const location = useLocation();
  const refresh = location.state?.refresh;

  // Map lưu text comment theo từng photoId
  const [commentTextByPhoto, setCommentTextByPhoto] = useState({});
  // Map lưu lỗi theo từng photoId
  const [commentErrorByPhoto, setCommentErrorByPhoto] = useState({});

  //HAI-1
  const [editing, setEditing] = useState(null);
  // editing = { photoId, commentId } hoặc null -> đánh dấu cmt nào đang đc edit, thuộc photo nào
  const [editText, setEditText] = useState("");
  // lưu nội dung mới
  //HAI-1

  useEffect(() => {
    fetchModel(`/api/photo/${userId}`)
      .then((data) => setPhotos(data))
      .catch((err) => console.log(err));
  }, [userId, refresh]);

  // Update text đang gõ cho 1 photo cụ thể
  const handleChangeCommentText = (photoId, value) => {
    setCommentTextByPhoto((prev) => ({
      ...prev, // copy lại state cũ
      [photoId]: value, // [photo] là key động theo biến, vì có nhiều ảnh nên cần làm vậy để lưu được value của mọi cmt ở mọi ảnh
    }));
    // Khi user bắt đầu gõ lại thì xóa lỗi cũ cho photo đó
    setCommentErrorByPhoto((prev) => ({
      ...prev,
      [photoId]: "",
    }));
  };

  // Submit comment cho 1 photo
  const handleAddComment = async (photoId) => {
    const text = (commentTextByPhoto[photoId] || "").trim(); //trạng thái text đang gõ của ảnh

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

  /*  const handleDeleteComment = async (photoId, commentId) => { // MỘT
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(
        `${BASE_URL}/commentsOfPhoto/${photoId}/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        let msg = "Failed to delete comment";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (e) {}
        alert(msg);
        return;
      }
      // update UI ngay: remove comment khỏi đúng photo
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) => {
          if (p._id !== photoId) return p;
          return {
            ...p,
            comments: p.comments.filter((c) => c._id !== commentId),
          };
        })
      );
    } catch (err) {
      console.error("Delete comment error:", err);
      alert("Cannot connect to server");
    }
  }; */
  {
    /*
  //HAI-2
  const startEditComment = (photoId, cmt) => {
    // id của photo và bản thân cmt
    setEditing({ photoId, commentId: cmt._id });
    // web biết đang sửa cmt nào thuộc ảnh nào
    setEditText(cmt.comment || "");
    // đưa nd hiện tại vào text
  };
  //HAI-2
*/
  }
  {
    /*//HAI-3
  const saveEditComment = async (photoId, commentId) => {
    const text = (editText || "").trim();
    if (!text) return;

    try {
      const res = await fetch(
        `${BASE_URL}/commentsOfPhoto/${photoId}/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comment: text }),
        }
      );

      if (!res.ok) {
        return;
      }

      const updated = await res.json(); // BE trả về cmt mới để hiển thị

      setPhotos((prev) =>
        prev.map((p) =>
          p._id !== photoId
            ? p
            : {
                ...p,
                comments: p.comments.map((c) =>
                  c._id !== commentId
                    ? c
                    : {
                        ...c,
                        comment: updated.comment,
                        date_time: updated.date_time,
                      }
                ),
              }
        )
      );

      setEditing(null);
      setEditText("");
    } catch (err) {
      console.error("Edit comment error:", err);
    }
  };
  //HAI-3
*/
  }
  if (!photos || photos.length === 0) {
    return <Typography>No photos available.</Typography>;
  }

  return (
    // divider là đường phân cách
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

            {p.comments.map((c) => {
              //const isMine = // MỘT
              //currentUser &&
              //c.user &&
              //String(c.user._id) === String(currentUser._id);

              {
                /*//HAI-4
              const isMine =
                currentUser &&
                c.user &&
                String(c.user._id) === String(currentUser._id);

              const isEditing =
                editing &&
                String(editing.photoId) === String(p._id) &&
                String(editing.commentId) === String(c._id);
            //HAI-4 */
              }

              return (
                <Card
                  key={c._id}
                  style={{ marginTop: "10px", padding: "10px" }}
                >
                  <Typography variant="body1">{c.comment}</Typography>

                  {/*HAI-5*
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          saveEditComment(p._id, c._id);
                        }
                        if (e.key === "Escape") {
                          setEditing(null);
                          setEditText("");
                        }
                      }}
                      style={{ marginTop: 4 }}
                    />
                  ) : (
                    <Typography variant="body1">{c.comment}</Typography>
                  )}
                  *HAI-5*/}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <Typography variant="caption">
                      —{" "}
                      <Link
                        to={`/users/${c.user._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {c.user.first_name} {c.user.last_name}
                      </Link>{" "}
                      ({new Date(c.date_time).toLocaleString()})
                    </Typography>

                    {/*HAI-6*
                    {isMine ? (
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => startEditComment(p._id, c)}
                        disabled={isEditing}
                      >
                        {"EDIT"}
                      </Button>
                    ) : null}
                    *HAI-6*/}

                    {/* //MỘT
                    {isMine ? (
                      <Button
                        size="small"
                        color="error"
                        variant="text"
                        onClick={() => handleDeleteComment(p._id, c._id)}
                      >
                        DELETE
                      </Button>
                    ) : null} */}
                  </div>
                </Card>
              );
            })}

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
