import apiInstance from "@api/apiInstance";
import { useTable, usePagination, useSortBy } from "react-table";
import { useEffect, useState, useMemo } from "react";

const Logmanagment = () => {
  const [data, setData] = useState([]);
  const [loaderActive, setLoaderActive] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      {
        Header: "Session ID",
        accessor: "session_id",
      },
      {
        Header: "User Name",
        accessor: "user_name",
      },
      {
        Header: "Name",
        accessor: "user_full_name",
      },
      {
        Header: "Login Time",
        accessor: "login_time",
      },
      {
        Header: "Logout Time",
        accessor: "logout_time",
        Cell: ({ value }) => (
          <span style={{ color: value ? "inherit" : "red" }}>
            {value ? value : "Session Not Logged out"}
          </span>
        ),
      },
      {
        Header: "Refrer",
        accessor: "referer",
      },
      {
        Header: "Browser",
        accessor: "user_agent",
      },
      {
        Header: "IP",
        accessor: "ip",
      },
      {
        Header: "Country",
        accessor: "country",
      },
      {
        Header: "City",
        accessor: "city",
      },

    ],
    []
  );

  const fetchData = async (pageNumber) => {
    setLoaderActive(true);
    try {
      const response = await apiInstance("/logs.php", "POST", {
        page: pageNumber,
        limit,
      });
      const responseData = response?.data || {};
      setData(responseData.data || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoaderActive(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]); 

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount: totalPages,
      initialState: { 
        pageSize: limit,
        pageIndex: 0
      }
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
  } = tableInstance;

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="p-4">
        <div className=" fle justify-between"> <button className=" py-1 px-2 bg-[#0052CC] rounded-t justify-end
         text-white" onClick={() => fetchData()}>Reload</button></div>
      {loaderActive ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm"
          >
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, j) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="p-3 text-left text-sm font-medium text-gray-700 border-b"
                      key={j}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {tablePage.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100" key={i}>
                    {row.cells.map((cell, j) => (
                      <td
                        {...cell.getCellProps()}
                        className="p-3 text-sm text-gray-800 border-b"
                        key={j}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={`px-4 py-2 text-sm font-medium text-white bg-[#0052CC] rounded-md ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`px-4 py-2 text-sm font-medium text-white bg-[#0052CC] rounded-md ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logmanagment;
