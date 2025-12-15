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
      <Typography>Description: {user.description}</Typography>
      <br />
      <Link to={`/photos/${user._id}`}>Photos</Link>
    </div>
  );
}

export default UserDetail;
