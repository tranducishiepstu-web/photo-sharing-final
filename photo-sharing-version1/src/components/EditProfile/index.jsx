import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const BASE_URL = "https://mrj3rp-8081.csb.app";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
    occupation: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/profile/me`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || "Failed to load profile");
        }
        return res.json();
      })
      .then((data) =>
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          location: data.location || "",
          occupation: data.occupation || "",
          description: data.description || "",
        })
      )
      .catch((e) => setError(e.message || "Cannot connect to server"));
  }, []);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value })); // key là tên field
  };

  const save = async () => {
    setError("");

    const first = (form.first_name || "").trim();
    const last = (form.last_name || "").trim();
    if (!first) return setError("first_name is required");
    if (!last) return setError("last_name is required");

    try {
      const res = await fetch(`${BASE_URL}/profile/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          first_name: first,
          last_name: last,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Failed to save profile");
        return;
      }

      // TỐI GIẢN: save xong reload để mọi thứ tự cập nhật
      window.location.reload();
      // hoặc nếu bạn muốn quay về trang trước rồi reload:
      // navigate(-1);
      // window.location.reload();
    } catch (e) {
      setError("Cannot connect to server");
    }
  };

  return (
    <Card style={{ marginTop: 20 }}>
      <CardContent>
        <Typography variant="h5" style={{ marginBottom: 10 }}>
          Edit Profile
        </Typography>

        <TextField
          fullWidth
          label="First name"
          value={form.first_name}
          onChange={onChange("first_name")}
          style={{ marginBottom: 12 }}
        />
        <TextField
          fullWidth
          label="Last name"
          value={form.last_name}
          onChange={onChange("last_name")}
          style={{ marginBottom: 12 }}
        />
        <TextField
          fullWidth
          label="Location"
          value={form.location}
          onChange={onChange("location")}
          style={{ marginBottom: 12 }}
        />
        <TextField
          fullWidth
          label="Occupation"
          value={form.occupation}
          onChange={onChange("occupation")}
          style={{ marginBottom: 12 }}
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          minRows={3}
          value={form.description}
          onChange={onChange("description")}
          style={{ marginBottom: 12 }}
        />

        {error ? (
          <Typography style={{ color: "red", marginBottom: 10 }}>
            {error}
          </Typography>
        ) : null}

        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
