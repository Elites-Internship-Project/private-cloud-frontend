import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useLoading } from "../LoadingProvider";
import { useState } from "react";
import { getAuthenticatedData, isAuthenticated } from "../auth/helper";
import { getLogTable } from "../services/adminService";

function createLogEntry(dateTime, operation, message, result) {
  return { dateTime, operation, message, result };
}

var logEntries = [];
export default function LogTable({ token, user }) {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
  const [logStateEntry, setLogStateEntry] = useState([]);
  const prefetch = () => {
    startLoading();
    getLogTable(token).then((response) => {
      if (!response.error) {
        // setMessage("user created");
        setLogs(response.data.data);
        stopLoading();
      } else {
        stopLoading();
        setError("Some error occured while fetching logs");
      }
    });
  };
  useEffect(() => {
    prefetch();
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      console.log("assigning logs");
      logEntries = [];
      logs.map((log) => {
        logEntries.push(
          createLogEntry(
            log.TIMESTAMP,
            log.EVENT_TYPE,
            log.MSG_USER_FRIENDLY,
            log.RESULT
          )
        );
      });
      setLogStateEntry(logEntries);
    }
  }, [logs]);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <TableContainer component={Paper} style={{ maxHeight: "100%" }}>
        {error ? (
          error
        ) : (
          <Table
            stickyHeader
            sx={{ minWidth: 650 }}
            size="small"
            aria-label="log table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Date Time</TableCell>
                <TableCell>Operation/Event</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logStateEntry.map((logEntry, index) => (
                <TableRow key={index}>
                  <TableCell>{logEntry.dateTime}</TableCell>
                  <TableCell>{logEntry.operation}</TableCell>
                  <TableCell
                    style={{
                      color: logEntry.result === "Success" ? "green" : "red",
                    }}
                  >
                    {logEntry.result}
                  </TableCell>
                  <TableCell>{logEntry.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
}
