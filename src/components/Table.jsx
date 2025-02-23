import React, { useState ,useEffect} from 'react'
import Loader from "./Loader";
import ShowOrders from "./ShowOrders";
import { useInView } from "react-intersection-observer";
const Table = () => {
  const { orders, fetchNextPage, hasNextPage, isLoading, isError } =
  ShowOrders();
const { ref, inView } = useInView();
const [sortField, setSortField] = useState("customerName");
const [sortDirection, setSortDirection] = useState("asc");

useEffect(() => {
  if (inView && hasNextPage) {
    fetchNextPage();
  }
}, [inView, hasNextPage, fetchNextPage]);


const sortedOrders = React.useMemo(() => {
  return [...orders].sort((a, b) => {
    const compare = a[sortField] < b[sortField] ? -1 : 1;
    return sortDirection === "asc" ? compare : -compare;
  });
}, [orders, sortField, sortDirection]);


const handleSort = (field) => {
  const newDirection =
    sortField === field && sortDirection === "asc" ? "desc" : "asc";
  setSortField(field);
  setSortDirection(newDirection);
};


if (isError) {
  return (
    <div className="error-message">
      Error loading data. Please try again later.
    </div>
  );
}
  return (
    <div className="table-container">
    <table className="order-table">
      <thead>
        <tr>
          <th onClick={() => handleSort("customerName")}>Customer Name</th>
          <th onClick={() => handleSort("orderAmount")}>Order Amount</th>
          <th onClick={() => handleSort("status")}>Status</th>
          <th onClick={() => handleSort("createdAt")}>Created At</th>
        </tr>
      </thead>
      <tbody>
        {sortedOrders.map((order) => (
          <tr key={order.id}>
            <td>{order.customerName}</td>
            <td>${order.orderAmount.toFixed(2)}</td>
            <td>{order.status}</td>
            <td>{new Date(order.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {isLoading && <Loader />}
    <div ref={ref} style={{ height: "20px", marginTop: "10px" }} />
  </div>
  )
}

export default Table