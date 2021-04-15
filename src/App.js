import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "./components/Table";
import { CSVLink } from "react-csv";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";

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

  const headers = [
    { label: "status", key: "status" },
    { label: "Name", key: "name" },
    { label: "Device Type", key: "deviceType" },
    { label: "Serial", key: "serial" },
    { label: "Device Id", key: "deviceId" },
    { label: "Space", key: "space" },
    { label: "Commissioned", key: "commissioned" },
  ];

  let fileReader;
  const handleFileRead = (e) => {
    const content = fileReader.result;
    return JSON.parse(content);
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();

    fileReader.readAsText(file);
  };
  const onFileJson = () => {
    const x = handleFileRead();
    setData(x);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <CssBaseline />
      <div className="justify-center bg-gray-50 flex shadow-xl">
        <div
          onClick={() => {
            setMain(true);
            setTab2(false);
          }}
          className={`my-5 mx-3`}
        >
          <span
            className={`${
              main ? "border-b-2 border-red-500 font-bold" : ""
            } text-gray-700  cursor-pointer   py-2 px-5 hover:border-b-2 `}
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
              tab2 ? "border-b-2 border-red-500 font-bold" : ""
            } text-gray-700  cursor-pointer   py-2 px-5 hover:border-b-2 `}
          >
            Safe
          </span>
        </div>
      </div>
      <div className={`${main ? "block" : "hidden"} mt-5`}>
        <h1 className="font-bold text-4xl my-10 mx-5">Device Status</h1>
        <EnhancedTable columns={columns} data={data} setData={setData}>
          <MenuItem onClick={handleClick}>Upload JSON</MenuItem>
          <MenuItem>
            {" "}
            <CSVLink
              data={data}
              target="_blank"
              filename="Generated_Table"
              headers={headers}
            >
              Download CSV
            </CSVLink>
          </MenuItem>
        </EnhancedTable>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <form className="mx-10 my-5">
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
              className="w-full"
              autoFocus
            />
          </form>
          <div>
            <div className="border-3 p-3 m-3 border">
              <label>Upload a JSON file</label>
              <br />
              <input
                type="file"
                id="file"
                accept=".json"
                className="m-3"
                onChange={(e) => handleFileChosen(e.target.files[0])}
              />
              <br />
              <button
                className=" p-3 bg-blue-400 mb-1  rounded-lg mt-2 text-white font-bold hover:bg-blue-900"
                onClick={onFileJson}
              >
                upload
              </button>
            </div>
          </div>
        </Popover>
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
