import React, { useEffect, useState } from "react";
import Header from "@components/common/Header";
import Sidebar from "@components/common/Sidebar";
import { UserPlus, UserRound } from "lucide-react";
import apiInstance from "@api/apiInstance";
import { useTable, usePagination, useSortBy } from 'react-table';
import { EyeClosed, Eye, UserRoundPen , UserX , Search , UserCheck  , Logs , CircleX } from 'lucide-react';
import Logmanagment from "./Logmanagment";

const PasswordColumn = ({ value }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };
  
    return (
      <div className="flex items-center">
        <div className="whitespace-normal break-words" style={{ maxWidth: '120px' }}>
          {isPasswordVisible ? value : '••••••••••••'}
        </div>
        <button onClick={togglePasswordVisibility} className="ml-2">
          {isPasswordVisible ? <Eye size={16} /> : <EyeClosed size={16} />}
        </button>
      </div>
    );
};

const Credentails = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loaderActive, setLoaderActive] = useState(false);
    const [data, setData] = useState([]);
    const [isEditing, setIsEditing] = useState(false); 
    const [currentUserId, setCurrentUserId] = useState(null); 
    const [logsActive , setLogsActive] = useState(false);
  
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
      if (isModalOpen) {
        setIsEditing(false); 
        setCurrentUserId(null); 
      }
    };
  
    // State for form fields
    const [formData, setFormData] = useState({
      employeeName: "",
      email: "",
      userName: "",
      password: "",
      userRole: "",
    });
  
    const fetchData = async () => {
      setLoaderActive(true);
      try {
        const response = await apiInstance('/users.php', 'GET');
        setData(response?.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoaderActive(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    // Username generator function
    function generateUsername() {
      return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    // Handle form submission
    const handleAddEmpSubmit = async (e) => {
      e.preventDefault();
    
      // Check if all fields are filled
      if (Object.values(formData).some((field) => !field)) {
        alert("Please fill out all fields.");
        return;
      }
    
      // Prepare the data as a plain object
      const employeeData = { ...formData };
    
      if (isEditing) {
        // Add the current user ID for updating
        employeeData.id = currentUserId;
  
    
        // Update user
        const response = await apiInstance(`/users.php`, 'PATCH', employeeData, '');
        if (response.status === 200) {
          alert("User updated successfully.");
        } else {
          alert("Failed to update user. Please try again.");
        }
      } else {
        // Add new user
        const response = await apiInstance('/users.php', 'POST', employeeData);
        if (response.status === 200) {
          alert("User added successfully.");
        } else {
          alert("Failed to add user. Please try again.");
        }
      }
  
    
      setIsModalOpen(false);
      setFormData({
        employeeName: "",
        email: "",
        userName: generateUsername(),
        password: "",
        userRole: "",
      });
      fetchData();
    };
  
    const handleEditClick = (user) => {
      setFormData({
        employeeName: user.user_full_name,
        email: user.user_email_id,
        userName: user.user_whatsapp_number,
        password: user.password, 
        userRole: user.user_position,
      });
      setCurrentUserId(user.user_id); 
      setIsEditing(true); 
      setIsModalOpen(true);
    };
  
    const suspendUser = async(user, action) => {
      const user_id = user?.user_id;
      setLoaderActive(true);
      try {
        const response = await apiInstance(`/users.php?user_id=${user_id}&suspend=${action}`, 'GET');
        if (response.status === 200) {
          alert('User Updated');
          fetchData();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoaderActive(false);
      }
    };
  
    const columns = React.useMemo(
      () => [
        // { Header: 'ID', accessor: 'user_id' },
        {
          Header: 'Name',
          accessor: 'user_full_name',
          Cell: ({ row }) => {
            const name = row.original.user_full_name;
            const email = row.original.user_email_id;
        
            return (
              <div className="flex items-center gap-3">
                {/* Avatar with initials */}
                <div
                  className="w-8 h-8 flex justify-center items-center rounded-full bg-blue-500 text-white font-bold"
                  style={{ minWidth: '2rem' }}
                >
                  {name
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()}
                </div>
        
                {/* Name and email */}
                <div>
                  <div className="font-semibold">{name}</div>
                  <div className="text-sm text-gray-500">{email}</div>
                </div>
              </div>
            );
          },
        }
        ,
        { Header: 'Username', accessor: 'user_whatsapp_number' },
        { Header: 'Password', accessor: 'password', Cell: ({ value }) => <PasswordColumn value={value} /> },
        { Header: 'Email', accessor: 'user_email_id' },
        {
          Header: 'Role',
          accessor: 'user_position',
          Cell: ({ value }) => {
            switch (value) {
              case "1":
                return 'Sub-admin';
              case "2":
                return 'Manager';
              case "3":
                return 'Sales Person';
              default:
                return 'Unknown';
            }
          },
        },
        {
          Header: 'Active',
          accessor: 'user_active',
          Cell: ({ value }) => (
            <div style={{ border: value === "Y" ? '1px solid green' : 'none', color: value === "Y" ? 'green' : 'red', borderRadius: '20px', textAlign: 'center', fontSize: 'small' }}>
              {value === "Y" ? 'Active' : 'Not Active'}
            </div>
          ),
        },
        {
          Header: 'Suspend',
          accessor: 'suspend',
          Cell: ({ row }) => (
            <div className="flex justify-center">
              <button onClick={async () => await suspendUser(row.original, row.original.user_active === 'Y' ? 'true' : 'false')} className="text-red-500 font-semibold gap-1 flex">
                {row.original.user_active === 'Y' ? <UserX size={19} /> : <UserCheck size={19} />} 
              </button>
            </div>
          ),
        },
        
        {
          Header: 'Actions',
          accessor: 'actions',
          Cell: ({ row }) => (
            <div className="flex justify-center gap-2">
              <button onClick={() => handleEditClick(row.original)} className="text-blue-500 font-semibold gap-1 flex">
                <UserRoundPen size={20} /> 
              </button>
              <button onClick={() => handleEditClick(row.original)} className="text-blue-500 font-semibold gap-1 flex">
                <Eye size={20} /> 
              </button>
            </div>
          ),
        },
      ],
      []
    );
  
    const filteredData = React.useMemo(() => {
      return data.filter(item => {
        const searchStr = searchTerm.toLowerCase();
        return (
          item.user_full_name?.toLowerCase().includes(searchStr) ||
          item.user_email_id?.toLowerCase().includes(searchStr) ||
          item.user_whatsapp_number?.toLowerCase().includes(searchStr) ||
          item.user_position?.toString().toLowerCase().includes(searchStr)
        );
      });
    }, [data, searchTerm]);
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      nextPage,
      previousPage,
      state: { pageIndex },
    } = useTable(
      {
        columns,
        data: filteredData || [], 
        initialState: { pageSize: 20 },
      },
      useSortBy,
      usePagination
    );
  
    return (
      <>
        <Header />
        <main className="flex">
          <Sidebar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
          />
          <section className="flex-1 my-4 ml-4 mr-7">
            {/* Action bar */}
            <div className="w-full  p-1  rounded-md flex justify-between">
              <div className="flex flex-col text-sm gap-2 p-1 rounded pl-1">
                <span className="text-black font-semibold p-1 text-[20px] flex gap-1 rounded-md cursor-pointer">
                  <UserRound size={22} />
                  All User
                </span>
                <span>
                All Registered users for KYC 
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleModal}
                  className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 font-semibold cursor-pointer text-sm"
                >
                  Add  User
                  <UserPlus size={18} />
                </button>
                <button
                  onClick={() => setLogsActive(true)}
                  className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 font-semibold cursor-pointer text-sm"
                >
                  Check Logs
                  <Logs size={18} />
                </button>
              </div>
            </div>
  
  
            {!logsActive && (
  
              <>
            {/* Employee List */}
            <div className="mt-2 p-1 border rounded-md bg-white shadow-sm select-none">
              <div className="flex justify-end items-center">
                  <div className="flex items-center w-[300px] text-sm p-2 border rounded-md mb-2">
                      <Search size={20} />
                      <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ml-2 w-full border-none"
                      />
                  </div>
              </div>
              
              <table {...getTableProps()} className="w-full border-collapse">
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="border p-2 text-sm">
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map(row => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="border">
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()} className="p-1 ">
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
              </>
            )}
  
            {logsActive && (
              <>
              <div className=" mt-2">
                <div className=" flex justify-between border-b-2 pb-1">
                    <p className="w-[100px] px-2 border rounded bg-[#0052CC] text-white">LOGS</p>
                    <CircleX size={20} onClick={() => setLogsActive(false)} />
                </div>
                <Logmanagment />
              </div>
              </>
            )}
  
  
  
          </section>
        </main>
  
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex w-full z-50 items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-2 rounded-md shadow-md w-[900px]">
              <h2 className="text-md font-semibold mb-4  border-b-2 pb-2">{isEditing ? "Edit Employee" : "Add Employee"}</h2>
              <form onSubmit={handleAddEmpSubmit} className="px-8">
                <div className="grid grid-cols-2 gap-3 ">
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Employee Name</label>
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleChange}
                      required
                      className="border rounded-md w-full p-1 mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border rounded-md w-full p-1 mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">User Role</label>
                    <select
                      name="userRole"
                      value={formData.userRole}
                      onChange={handleChange}
                      required
                      className="border rounded-md w-full p-1 mt-1"
                    >
                      <option value="" disabled>Select role</option>
                      <option value="1">Sub-admin</option>
                      <option value="2">Manager</option>
                      <option value="3">Sales Person</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pb-3">
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Username</label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className="border rounded-md w-full p-1 mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Password</label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!isEditing}
                      className="border rounded-md w-full p-1 mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={toggleModal}
                    type="button"
                    className="bg-gray-500 text-white px-2 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0052CC] text-white px-2 py-1 rounded-md"
                  >
                    {isEditing ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
};

export default Credentails;
