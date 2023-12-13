import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAuthenticatedData, isAuthenticated } from "../auth/helper";
import { changePassword } from "../services/userService";
import { useState } from "react";
import Base from "../components/base";
import { useLoading } from "../LoadingProvider";
import { useRef } from "react";

export default function ChangePassword() {
  const notifyRef = useRef(null);
  const authenticatedData = isAuthenticated();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { user, token } = getAuthenticatedData(authenticatedData);
  const [variables, setVariables] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
    success: false,
    error: false,
  });
  const { oldPassword, newPassword, confirmPassword, loading, success, error } =
    variables;
  const handleChange = (key) => (event) => {
    if (
      key == "confirmPassword" ||
      (key == "newPassword" && confirmPassword != "")
    ) {
      if (
        (key == "confirmPassword" && event.target.value != newPassword) ||
        (key == "newPassword" && event.target.value != confirmPassword)
      ) {
        setConfirmPasswordMatchError(true);
      } else {
        setConfirmPasswordMatchError(false);
      }
    }

    setVariables({ ...variables, error: false, [key]: event.target.value });
  };

  const [confirmPasswordMatchError, setConfirmPasswordMatchError] =
    useState(false);

  const onSubmit = (event) => {
    event.preventDefault();

    setVariables({ ...variables, error: false, loading: true });
    if (confirmPasswordMatchError) {
      console.log("password is incorrect");
      return;
    } else {
      startLoading();
      changePassword(token, {
        old_password: variables.oldPassword,
        new_password: variables.newPassword,
        email: user.Email,
      })
        .then((response) => {
          console.log(response);
          if (!response.error) {
            setVariables({
              ...variables,
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
              loading: false,
              success: true,
            });
            stopLoading();
            if (notifyRef.current) {
              notifyRef.current("Password Change Successfull", "success");
            }
          } else {
            setVariables({ ...variables, error: true, loading: false });
            stopLoading();
            if (notifyRef.current) {
              notifyRef.current("Password not changed", "error");
            }
          }
        })

        .catch((e) => {
          setVariables({
            ...variables,
            loading: false,
            success: false,
            error: true,
          });
          stopLoading();
          // alert.show(`PASSWORD IS INCORRECT`, {
          //     type: 'error',
          //     timeout: '3000'
          // })
          console.log(e);
        });
    }
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
            Change password
          </Typography>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Old Password"
              type="password"
              id="oldPassword"
              variant="outlined"
              onChange={handleChange("oldPassword")}
              value={oldPassword}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              variant="outlined"
              onChange={handleChange("newPassword")}
              value={newPassword}
            />
            <TextField
              error={confirmPasswordMatchError}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              variant="outlined"
              onChange={handleChange("confirmPassword")}
              value={confirmPassword}
              helperText={
                confirmPasswordMatchError ? "Passwords don't match." : ""
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Container>
    </Base>
  );
}
