import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(1),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(
  name,
  deviceType,
  serial,
  deviceId,
  floor,
  space,
  commissioned
) {
  return { name, deviceType, serial, deviceId, floor, space, commissioned };
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});
const headers = [
  { label: "status", key: "status" },
  { label: "name", key: "name" },
  { label: "deviceType", key: "deviceType" },
  { label: "serial", key: "serial" },
  { label: "deviceId", key: "deviceId" },
  { label: "space", key: "space" },
  { label: "commissioned", key: "commissioned" },
];
const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const ProductTable = () => {
  const [products, setProducts] = useState("");
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/sagarkhan/sagarkhan.github.io/master/data-set.json"
      )
      .then((res) => {
        console.log(res.data);
        console.log(res.data.length);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const csvReport = {
    data: products,
    headers: headers,
    filename: "ExportedTable.csv",
  };
  const arr = [];

  for (var i = 0; i < products.length; i++) {
    arr.push(
      createData(
        `${products[i].name}`,
        `${products[i].deviceType}`,
        `${products[i].serial}`,
        `${products[i].deviceId}`,
        `${products[i].floor}`,
        `${products[i].space}`,
        `${products[i].commissioned ? "yes" : "no"}`
      )
    );
  }
  const rows = arr.sort((a, b) => (a.name < b.name ? -1 : 1));
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { items, requestSort, sortConfig } = useSortableData(products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Device Name</StyledTableCell>
              <StyledTableCell align="right">Device Type</StyledTableCell>
              <StyledTableCell align="right">Serial Number</StyledTableCell>
              <StyledTableCell align="right">Device Id</StyledTableCell>
              <StyledTableCell align="right">Floor</StyledTableCell>
              <StyledTableCell align="right">Space</StyledTableCell>
              <StyledTableCell align="right">Commisioned</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.deviceType}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.serial}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.deviceId}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.floor}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.space}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.commissioned}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 15, 20, { label: "All", value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* <table>
        <caption className="text-3xl text-gray-500 py-2 shadow-lg font-bold">
          Products
        </caption>

        <thead>
          <tr>
            <th>
              <button
                type="button"
                onClick={() => requestSort("name")}
                className={getClassNamesFor("name")}
              >
                Name
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("serial")}
                className={getClassNamesFor("serial")}
              >
                serial
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("floor")}
                className={getClassNamesFor("floor")}
              >
                Floor
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("deviceId")}
                className={getClassNamesFor("deviceId")}
              >
                Device ID
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((product) => (
            <tr key={product.deviceId}>
              <td>{product.name}</td>
              <td>{product.serial}</td>
              <td> {product.floor}</td>
              <td> {product.deviceId}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <button className="flex justify-content-center items-center p-3 bg-blue-400 rounded-lg m-5 text-white font-bold hover:bg-blue-900">
        <CSVLink {...csvReport}> Export to CSV</CSVLink>
      </button>
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <ProductTable />
    </div>
  );
}
