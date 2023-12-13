import React from "react";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useEffect } from "react";
import { useLoading } from "../LoadingProvider";
import { getUserCount } from "../services/adminService";

const users = [
  { id: 1, name: "User 1", permission: "read" },
  { id: 2, name: "User 2", permission: "insert" },
  { id: 3, name: "User 3", permission: "update" },
  { id: 4, name: "User 4", permission: "delete" },
  // Add more user data with different permissions
];

function UsersDashComponent({ token, user }) {
  const [totalUsers, setTotalUsers] = useState(0);
  const [readUsers, setReadUsers] = useState(0);
  const [insertUsers, setInsertUsers] = useState(0);
  const [updateUsers, setUpdateUsers] = useState(0);
  const [deleteUsers, setDeleteUsers] = useState(0);
  const [error, setError] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoading();

  const preload = () => {
    startLoading();
    getUserCount(token).then((response) => {
      console.log(response.data.data);
      if (response.data.status) {
        // setMessage("user created");
        setTotalUsers(response.data.data.active_users);
        setReadUsers(response.data.data.read_perm);
        setUpdateUsers(response.data.data.edit_perm);
        setDeleteUsers(response.data.data.delete_perm);
        setInsertUsers(response.data.data.write_perm);
        stopLoading();
      } else {
        stopLoading();
        setError("Some error occured while fetching user info");
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

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
            <span style={{ fontSize: 20, alignSelf: "center" }}>
              Total Users: {totalUsers}
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
            <span style={{ fontSize: 12 }}>No. of Users with permissions:</span>
          </Grid>
          <Grid item xs={3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div style={{ color: "blue" }}>{readUsers}</div>
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
              <div style={{ color: "green" }}>{insertUsers}</div>
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
              <div style={{ color: "orange" }}>{updateUsers}</div>
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
              <div style={{ color: "red" }}>{deleteUsers}</div>
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

export default UsersDashComponent;
