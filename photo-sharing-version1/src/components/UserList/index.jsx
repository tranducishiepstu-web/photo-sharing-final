import React, { useEffect, useState } from "react";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchModel("/api/user/list")
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("UserList error:", err);
        setUsers([]);
      });
  }, []);

  return (
    <List component="nav">
      {users.map((u) => (
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
  );
}

export default UserList;
