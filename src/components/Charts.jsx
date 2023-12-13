import * as React from "react";
import { BarPlot } from "@mui/x-charts/BarChart";
import { LinePlot } from "@mui/x-charts/LineChart";
import { ChartContainer } from "@mui/x-charts/ChartContainer";

import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsLegend } from "@mui/x-charts/ChartsLegend";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { getChartsData } from "../services/adminService";

export default function Charts({ token, user }) {
  const [dataSource, setDataSource] = useState("inlet");
  const [error, setError] = useState("");
  const [inletData, setInletData] = useState([1, 2, 3, 4, 5]);
  const [outletData, setOutletData] = useState([1, 2, 3, 4, 5]);
  const [pumpData, setPumpData] = useState([1, 2, 3, 4, 5]);
  const [inletXAxis, setInletXAxis] = useState([10, 20, 30, 40, 50]);
  const [outletXAxis, setOutletXAxis] = useState([10, 20, 30, 40, 50]);
  const [pumpXAxis, setPumpXAxis] = useState([10, 20, 30, 40, 50]);

  const handleSelectChange = (e) => {
    setDataSource(e.target.value);
  };

  const loadData = async () => {
    await getChartsData(token, "7").then((response) => {
      console.log(response.data);
      if (response.data.status) {
        let inlet = [];
        let inletXaxis = [];
        console.log("inlet: ");

        response.data.data.inlet_records.forEach((v) => {
          // console.log(v.V);
          inlet.push(v.VALUE);
          inletXaxis.push(new Date(v.DATETIME));
        });
        setInletData(inlet.reverse());

        setInletXAxis(inletXaxis.reverse());

        inlet = [];
        inletXaxis = [];
        response.data.data.outlet_records.forEach((v) => {
          // console.log(v.V);
          inlet.push(v.VALUE);
          inletXaxis.push(new Date(v.DATETIME));
        });
        setOutletData(inlet.reverse());

        setOutletXAxis(inletXaxis.reverse());
        inlet = [];
        inletXaxis = [];
        response.data.data.pump_records.forEach((v) => {
          // console.log(v.V);
          inlet.push(v.VALUE);
          inletXaxis.push(new Date(v.DATETIME));
        });
        setPumpData(inlet.reverse());

        setPumpXAxis(inletXaxis.reverse());
        console.log(inlet);
      } else {
        // stopLoading();
        setError("Some error occured while fetching user info");
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ChartContainer
        series={[
          dataSource == "inlet"
            ? {
                type: "line",
                label: "Inlet",
                yAxisKey: "count",
                color: "red",
                data: inletData,
              }
            : dataSource == "outlet"
            ? {
                type: "line",
                label: "Outlet",
                yAxisKey: "count",
                color: "blue",
                data: outletData,
              }
            : {
                type: "line",
                label: "Pump",
                yAxisKey: "count",
                color: "green",
                data: pumpData,
              },
        ]}
        width={500}
        height={200}
        xAxis={[
          {
            id: "years",
            data:
              dataSource == "inlet"
                ? inletXAxis
                : dataSource == "outlet"
                ? outletXAxis
                : pumpXAxis,
            scaleType: "band",

            valueFormatter: (date) =>
              date instanceof Date
                ? date.toLocaleDateString("fr-FR", {
                    month: "2-digit",
                    day: "2-digit",
                  })
                : date.toString(),
          },
        ]}
        yAxis={[
          {
            id: "count",
            scaleType: "log",
          },
        ]}
      >
        {/* <ChartsLegend position="right" direction="column" /> */}
        <LinePlot></LinePlot>
        <ChartsXAxis label="Time" position="bottom" axisId="years" />
        <ChartsYAxis label="Results" position="left" axisId="count" />
      </ChartContainer>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginRight: 20,
        }}
      >
        <div>
          <select
            name="datasource"
            id="chart-datasource"
            class="form-select mb-3"
            value={dataSource}
            onChange={handleSelectChange}
          >
            <option value="inlet">Inlet</option>
            <option value="outlet">Outlet</option>
            <option value="pump">Pump</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "red" }}> ---- Inlet</span>
          <span style={{ color: "blue" }}> ---- Outlet</span>
          <span style={{ color: "green" }}> ---- Pump</span>
        </div>
      </div>
    </div>
  );
}
