import React from "react";

import GlobalFilter from "./GlobalFilter";

import { makeStyles } from "@material-ui/core/styles";

import Toolbar from "@material-ui/core/Toolbar";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
}));

const TableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { preGlobalFilteredRows, setGlobalFilter, globalFilter } = props;
  return (
    <Toolbar className={classes.root}>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </Toolbar>
  );
};

export default TableToolbar;
