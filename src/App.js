import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

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

const headers = [
  { label: "status", key: "status" },
  { label: "name", key: "name" },
  { label: "deviceType", key: "deviceType" },
  { label: "serial", key: "serial" },
  { label: "deviceId", key: "deviceId" },
  { label: "space", key: "space" },
  { label: "commissioned", key: "commissioned" },
];

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/sagarkhan/sagarkhan.github.io/master/data-set.json"
      )
      .then((res) => {
        console.log(res.data);
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
  const { items, requestSort, sortConfig } = useSortableData(products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <>
      <table>
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
      </table>
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
