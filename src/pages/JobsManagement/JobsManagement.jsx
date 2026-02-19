import React, { useEffect, useState } from 'react'
import userImg from '../../assets/Frame 22.png'
import notfImg from '../../assets/bell-01.png'
import activeImg from '../../assets/active.png'
import inactiveImg from '../../assets/inactive.png'
import editImg from '../../assets/edit.png'
import deleteImg from '../../assets/delete.png'
import searchImg from '../../assets/search.png'
import alertCircleImg from '../../assets/alertcircle.png'
import AddUserModal from '../../components/addUserModal/AddUserModal'
import Api from '../../services/Api'
import { ClipLoader } from 'react-spinners'

function JobsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [data, setData] = useState([]);
    const [deletedUserId, setDeletedUserId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const token = localStorage.getItem("token");


    // const filteredData = data.filter((item) => {
    //     const matchesSearch =
    //         item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item.email.toLowerCase().includes(searchTerm.toLowerCase());

    //     const matchesStatus =
    //         selectedStatus === "" || item.status === selectedStatus;

    //     return matchesSearch && matchesStatus;
    // });

    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === "" ||
            item.status === (selectedStatus === "true");

        return matchesSearch && matchesStatus;
    });



    const itemsPerPage = 10
    const [currentPage, setCurrentPage] = useState(1)

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);


    const handleDelete = () => {
        Api.delete(`api/user/${deletedUserId}`, {
            Authorization: `Bearer ${token}`,
        })
            .then(response => {
                setShowDeleteModal(false);
                setSelectedUser(null);
                if (response.status === 200) {
                    console.log("User deleted successfully");
                    setRefreshKey(prev => prev + 1); // Trigger re-fetching of data
                } else {
                    alert("Failed to delete user, try again");
                    console.error("Failed to delete user:", response);
                }
            })



    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowAddModal(true);
    }

    const handleCloseModal = () => {
        setShowAddModal(false);
        setSelectedUser(null);
    }


    useEffect(() => {
        setLoadingUsers(true);
        Api.get('api/user', {
            Authorization: `Bearer ${token}`,
        })
            .then(response => {
                setLoadingUsers(false);
                if (response.status === 200) {
                    console.log("User List:", response.data.data);
                    setData(response.data.data);
                } else {
                    console.error("Failed to fetch users:", response);
                }
            })
    }, [refreshKey])


    return (
        <div>

            <div>
                <div className='flex justify-between'>
                    <div className='text-[24px] font-medium'>Jobs Management</div>
                    <div className='flex items-center gap-4'>
                        <img src={notfImg} alt="" className='w-5 h-5' />
                        <img src={userImg} alt="" className='w-10 h-10 rounded-full' />
                    </div>
                </div>
                <div className='flex justify-between mt-4'>
                    <div className='flex'>
                        <div className='relative'>
                            <img
                                src={searchImg}
                                alt="search"
                                className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60'
                            />
                            <input
                                type="text"
                                placeholder="Search by Name, Email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className='bg-gray-100 pl-9 pr-3 py-2 rounded-md outline-none text-sm w-64'
                            />
                        </div>

                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            className='bg-gray-100 px-3 py-2 rounded-md ml-2 text-sm outline-none'
                        >
                            <option value="">Select Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                    </div>
                    <div
                        onClick={() => setShowAddModal(true)}
                        className='bg-[#413c5a] hover:bg-[#23202f] text-[14px] p-2 rounded-md text-white cursor-pointer'
                    >
                        + Add New User
                    </div>

                </div>
            </div>


            <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loadingUsers ?
                        <div className="flex items-center justify-center gap-4 h-[400px]">
                            <ClipLoader
                                color={'#413c5a'}
                                loading={true}
                                size={32}
                                aria-label="Loading Spinner"
                                data-testid="Loader"
                            />
                            <p className="text-gray-500">Loading users...</p>
                        </div>
                        :
                        <table className="min-w-full text-sm text-left">

                            <thead className="bg-[#413c5a] text-[#E7E7E6] uppercase">
                                <tr>
                                    <th className="px-3 py-3 text-[12px] font-medium">SL.No</th>
                                    <th className="px-3 py-3 text-[12px] font-medium">Name</th>
                                    <th className="px-3 py-3 text-[12px] font-medium">Email</th>
                                    <th className="px-3 py-3 text-[12px] font-medium">Initials</th>
                                    <th className="px-3 py-3 text-[12px] font-medium">Phone Number</th>
                                    <th className="px-3 py-3 text-[12px] font-medium">Role</th>
                                    <th className="px-3 py-3 text-[12px] font-medium">Status</th>
                                    <th className="px-3 py-3 text-[12px] font-medium">Title</th>
                                    <th className="px-3 py-3 text-[12px] font-medium text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="">
                                {currentData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 border-b border-gray-300">
                                        <td className="px-3 py-3">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-3 py-3 font-medium">{item.first_name}</td>
                                        <td className="px-3 py-3 text-gray-600">{item.email}</td>
                                        <td className="px-3 py-3">{item.initials}</td>
                                        <td className="px-3 py-3">9876543210</td>
                                        <td className="px-3 py-3">{item.role?.title}</td>
                                        <td className="px-3 py-3">
                                            <img src={item.status ? activeImg : inactiveImg} alt={item.status} className="w-6 h-3 inline-block" />
                                        </td>
                                        <td className="px-3 py-3">{item.title}</td>
                                        <td className="px-3 py-3 text-center space-x-2">
                                            <img src={editImg} alt="Edit" className="w-4 h-4 inline-block cursor-pointer"
                                                onClick={() => {
                                                    handleEdit(item);
                                                }}
                                            />
                                            <img
                                                src={deleteImg}
                                                alt="Delete"
                                                className="w-4 h-4 inline-block cursor-pointer"
                                                onClick={() => {
                                                    setSelectedUser(item);
                                                    setDeletedUserId(item.id);
                                                    setShowDeleteModal(true);
                                                }}
                                            />

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>


                <div className="flex justify-between items-center px-4 py-3 text-sm">


                    <div className="text-gray-600">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, totalItems)} of {totalItems} results
                    </div>


                    <div className="flex items-center gap-2">


                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            {"<"}
                        </button>


                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 border rounded
                                    ${currentPage === index + 1
                                        ? "bg-black text-gray-400"
                                        : "bg-white"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}


                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            {">"}
                        </button>

                    </div>
                </div>

            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-[361px] p-4 rounded-lg ">
                        <img src={alertCircleImg} className="w-[75px] h-[75px] mx-auto" alt="" />
                        <p className="mt-6 text-[#222323] text-[20px] leading-4 font-medium">
                            Are you sure want to delete?
                        </p>

                        <div className="flex mt-10 gap-4">
                            <div
                                onClick={() => setShowDeleteModal(false)}
                                className="border-[#D5D5D5] text-[#FF1717] hover:border-[#FF1717] duration-300 border w-full text-[16px] font-medium px-4 py-2 rounded-lg cursor-pointer"
                            >
                                No, Cancel
                            </div>
                            <div
                                onClick={handleDelete}
                                className="bg-[#FF1717] hover:bg-[#DE5555] duration-300 text-white w-full text-[16px] font-medium px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Yes, Delete
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AddUserModal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                selectedUser={selectedUser}
                setRefreshKey={setRefreshKey}
            />


        </div>
    )
}

export default JobsManagement
