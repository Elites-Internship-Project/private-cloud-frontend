import React from "react";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useEffect } from "react";
import { useLoading } from "../LoadingProvider";
import { getUserCount } from "../services/adminService";
import { getRoles } from "../utils/constants";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function UsersDashComponent2({ token, user }) {
  const [error, setError] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoading();
  const roles = getRoles(user.Role);

  return (
    <Grid container spacing={2}>
      {error ? (
        error
      ) : (
        <>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Icon style={{ fontSize: 60, color: "black" }}>group</Icon>
            <span
              style={{ fontSize: 20, alignSelf: "center" }}
              className="text-capitalize"
            >
              Welcome: {user.Name}
            </span>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 12 }}>Permissions you have</span>
          </Grid>
          <Grid item xs={3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {roles.read ? (
                <CheckCircleIcon style={{ fontSize: 20, color: "green" }} />
              ) : (
                <Icon style={{ fontSize: 20, color: "red" }}>cancel</Icon>
              )}
              <Icon style={{ fontSize: 25, color: "blue" }}>visibility</Icon>
              <div style={{ fontSize: 12, color: "blue", textAlign: "center" }}>
                Read
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {roles.insert ? (
                <CheckCircleIcon style={{ fontSize: 20, color: "green" }} />
              ) : (
                <Icon style={{ fontSize: 20, color: "red" }}>cancel</Icon>
              )}
              <Icon style={{ fontSize: 25, color: "green" }}>add_circle</Icon>
              <div
                style={{ fontSize: 12, color: "green", textAlign: "center" }}
              >
                Insert
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {roles.update ? (
                <CheckCircleIcon style={{ fontSize: 20, color: "green" }} />
              ) : (
                <Icon style={{ fontSize: 20, color: "red" }}>cancel</Icon>
              )}
              <Icon style={{ fontSize: 25, color: "orange" }}>edit</Icon>
              <div
                style={{ fontSize: 12, color: "orange", textAlign: "center" }}
              >
                Update
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {roles.delete ? (
                <CheckCircleIcon style={{ fontSize: 20, color: "green" }} />
              ) : (
                <Icon style={{ fontSize: 20, color: "red" }}>cancel</Icon>
              )}
              <Icon style={{ fontSize: 25, color: "red" }}>delete</Icon>
              <div style={{ fontSize: 12, color: "red", textAlign: "center" }}>
                Delete
              </div>
            </div>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default UsersDashComponent2;
