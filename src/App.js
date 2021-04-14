import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "./components/Table";
import { CSVLink } from "react-csv";

const App = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Device Name",
        accessor: "name",
      },
      {
        Header: "Device Type",
        accessor: "deviceType",
      },
      {
        Header: "Device ID",
        accessor: "deviceId",
      },
      {
        Header: "Serial No.",
        accessor: "serial",
      },
      {
        Header: "Floor",
        accessor: "floor",
      },

      {
        Header: "Space",
        accessor: "space",
      },
      {
        Header: "Commissioned",
        accessor: "commissioned",
      },
    ],
    []
  );
  const [main, setMain] = useState(true);
  const [tab2, setTab2] = useState(false);

  const [data, setData] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setData((item) =>
      item.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...item[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };
  const headers = [
    { label: "status", key: "status" },
    { label: "Name", key: "name" },
    { label: "Device Type", key: "deviceType" },
    { label: "Serial", key: "serial" },
    { label: "Device Id", key: "deviceId" },
    { label: "Space", key: "space" },
    { label: "Commissioned", key: "commissioned" },
  ];

  const csvReport = {
    data: data,
    headers: headers,
    filename: "ExportedTable.csv",
  };

  return (
    <div>
      <CssBaseline />
      <div className="justify-center bg-gray-50 flex shadow-md">
        <div>
          <button className="flex justify-content-center items-center p-3 bg-blue-400 rounded-lg mt-2 mx-3 text-white font-bold hover:bg-blue-900">
            <CSVLink {...csvReport}> Export to CSV</CSVLink>
          </button>{" "}
        </div>
        <div
          onClick={() => {
            setMain(true);
            setTab2(false);
          }}
          className={`my-5 mx-3`}
        >
          <span
            className={`${
              main ? "border-b-2" : ""
            } text-gray-700  cursor-pointer   py-2 px-5 hover:border-b-2 hover:border-blue-500`}
          >
            Overview
          </span>
        </div>
        <div
          onClick={() => {
            setMain(false);
            setTab2(true);
          }}
          className={`my-5 mx-3`}
        >
          <span
            className={`${
              tab2 ? "border-b-2" : ""
            } text-gray-700 cursor-pointer  py-2 px-5 hover:border-b-2 hover:border-blue-500`}
          >
            Safe
          </span>
        </div>
      </div>
      <div className={`${main ? "block" : "hidden"} mt-5`}>
        <form className="mx-10">
          <TextField
            rowsMin={5}
            value={data}
            onChange={(e) => setData(JSON.parse(e.target.value))}
            variant="outlined"
            fullWidth
            multiline
            id="feedback"
            label="Paste JSON here"
            name="text"
            rows={10}
            autoFocus
          />
        </form>
        <EnhancedTable
          columns={columns}
          data={data}
          setData={setData}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
        />
      </div>
      <div
        className={`${
          tab2 ? "block" : "hidden"
        } flex justify-items-center mx-5 items-center my-44 text-5xl font-extrabold text-blue-400`}
      >
        This is Tab2
      </div>
    </div>
  );
};

export default App;
