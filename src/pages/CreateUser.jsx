import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FormGroup, FormLabel } from "@mui/material";
import { createNewUser } from "../services/adminService";
import { getAuthenticatedData, isAuthenticated } from "../auth/helper";
import Base from "../components/base";
import { useState } from "react";
import { useLoading } from "../LoadingProvider";
import { useRef } from "react";

export default function CreateUser() {
  const notifyRef = useRef(null);
  const authenticatedData = isAuthenticated();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { token, user } = getAuthenticatedData(authenticatedData);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: {
      read: true,
      insert: false,
      update: false,
      delete: false,
    },
  });
  const resetUserForm = () => {
    console.log("reseting");
    setFormData({
      ...formData,
      email: "",
      password: "",
      name: "",
      role: {
        read: true,
        insert: false,
        update: false,
        delete: false,
      },
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    startLoading();
    // Convert the role checkboxes into a binary string
    const binaryRole = Object.values(formData.role)
      .map((isChecked) => (isChecked ? 1 : 0))
      .join("");

    createNewUser(token, {
      email: formData.email,
      name: formData.name,
      password: formData.password,
      role: binaryRole,
    }).then((response) => {
      console.log(response);
      if (response.status) {
        if (notifyRef.current) {
          notifyRef.current("User created", "success");
        }
        resetUserForm();
        stopLoading();
      } else {
        // setMessage("user not Created");

        if (notifyRef.current) {
          notifyRef.current("User not created", "error");
        }
        stopLoading();
      }
    });
    console.log("Form Data:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        role: {
          ...formData.role,
          [name]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const CheckboxLabels = () => {
    return (
      <>
        <FormLabel component="legend">Assign Permissions</FormLabel>

        <FormGroup row style={{ display: "flex" }}>
          <FormControlLabel
            disabled
            control={
              <Checkbox
                name="read"
                checked={formData.role.read ?? true}
                onChange={handleChange}
              />
            }
            label="Read"
            style={{ flex: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="insert"
                checked={formData.role.insert ?? false}
                onChange={handleChange}
              />
            }
            label="Insert"
            style={{ flex: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="update"
                checked={formData.role.update ?? false}
                onChange={handleChange}
              />
            }
            label="Edit"
            style={{ flex: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="delete"
                checked={formData.role.delete ?? false}
                onChange={handleChange}
              />
            }
            label="Delete"
            style={{ flex: 1 }}
          />
        </FormGroup>
      </>
    );
  };

  return (
    <Base user={user} notifyRef={notifyRef}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create User
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  onChange={handleChange}
                  value={formData.name}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </Grid>
              <Grid item xs={12}>
                {CheckboxLabels()}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </Base>
  );
}
