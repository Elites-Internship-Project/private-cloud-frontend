import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/userService";
import {
  isAuthenticated,
  authenticate,
  getAuthenticatedData, getHeaders,
} from "../auth/helper/index";
import { Roles, themeConstant } from "../utils/constants";
import Copyright from "../components/Copyright";
import Alert from "../components/Alert";
import { useEffect } from "react";
import Loading from "../components/loader";
import { useRef } from "react";
const defaultTheme = createTheme(themeConstant);

export default function Login() {
  const navigate = useNavigate();

  const performRedirect = () => {
    const user = isAuthenticated();
    if (user) {
      //TODO: check for default not-fouond case
      if (user.data.Role == Roles.ADMIN) {
        console.log("Admin");
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: false,
    didRedirect: false,
  });
  const notifyRef = useRef(null);
  const [emptyEmailAdress, setEmptyEmailAdress] = useState(false);
  const [emptyPassword, setEmptyPassword] = useState(false);

  const { email, password, error, loading, didRedirect } = values;

  useEffect(() => {
    performRedirect();
  }, [didRedirect]);

  const handleChange = (name) => (event) => {
    if (name == "email") {
      setEmptyEmailAdress(false);
    } else if (name == "password") {
      setEmptyPassword(false);
    }
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    if (email == "") {
      setEmptyEmailAdress(true);
      return;
    }
    if (password == "") {
      setEmptyPassword(true);
      return;
    }

    setValues({ ...values, error: false });

    setIsLoading(true);

    await login({ email, password })
      .then((data) => {
        setIsLoading(false);
        console.log(data);
        if (data.data.status) {
          const res = data.data;

          authenticate(res, () => {
            setValues({ ...values, didRedirect: true });
          });

          getHeaders().then();
          // performRedirect();
        } else {
          if (notifyRef.current) {
            notifyRef.current(data.data.err, "error");
          }
          setValues({ ...values, error: data.data.err });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.log({ err });
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {notifyRef && <Alert notifyRef={notifyRef} />}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Loading isLoading={isLoading}></Loading>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(/static/backicc.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/static/logo-full-size.png" // Replace with the path to your image
              alt="Logo"
              style={{ width: "30%", height: "auto" }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              <TextField
                error={emptyEmailAdress}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleChange("email")}
                helperText={emptyEmailAdress ? "Field can't be empty" : ""}
              />
              <TextField
                margin="normal"
                error={emptyPassword}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                helperText={emptyPassword ? "Field can't be empty" : ""}
                onChange={handleChange("password")}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
