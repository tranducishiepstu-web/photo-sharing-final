import React, { useEffect, useState } from "react";
import { List, ListItemButton, ListItemText, TextField } from "@mui/material";
import { Link } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState(""); // 444

  useEffect(() => {
    fetchModel("/api/user/list")
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("UserList error:", err);
        setUsers([]);
      });
  }, []);
  const filteredUsers = users.filter((u) => {
    // 444
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
    return fullName.includes(q.trim().toLowerCase());
  });
  return (
    <>
      {/*<TextField // 444
        fullWidth
        size="small"
        placeholder="Search user..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginBottom: 10 }}
  /> */}
      <List component="nav">
        {filteredUsers.map((u) => (
          <ListItemButton component={Link} to={`/users/${u._id}`} key={u._id}>
            <ListItemText
              primary={`${u.first_name} ${u.last_name}`}
              secondary={`Photos: ${u.photo_count || 0} • Comments: ${
                u.comment_count || 0
              }`}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}

export default UserList;
