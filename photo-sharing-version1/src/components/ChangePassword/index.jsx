import React, { useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const BASE_URL = "https://mrj3rp-8081.csb.app";

export default function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSave = async () => {
    setError("");

    if (!oldPass.trim() || !newPass.trim()) {
      setError("Please fill all fields");
      return;
    }
    if (newPass !== newPass2) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ old_password: oldPass, new_password: newPass }),
      });

      if (!res.ok) {
        setError("Change password failed");
        setSaving(false);
        return;
      }

      setOldPass("");
      setNewPass("");
      setNewPass2("");
      setSaving(false);
      alert("Changed password!");
    } catch (e) {
      setError("Cannot connect to server");
      setSaving(false);
    }
  };

  return (
    <Card style={{ marginTop: 20 }}>
      <CardContent>
        <Typography variant="h5" style={{ marginBottom: 10 }}>
          Change Password
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="Old password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <TextField
          fullWidth
          type="password"
          label="New password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Confirm new password"
          value={newPass2}
          onChange={(e) => setNewPass2(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {error ? (
          <Typography style={{ color: "red", marginBottom: 10 }}>
            {error}
          </Typography>
        ) : null}

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          SAVE
        </Button>
        <br />
        <br />
        <Button variant="outlined" onClick={() => navigate("/users")}>
          Back
        </Button>
      </CardContent>
    </Card>
  );
}
