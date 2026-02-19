import React, { useEffect, useState } from "react";
import defaultProfImage from "../../assets/defaultprof.png";
import Api from "../../services/Api";
import { ClipLoader } from "react-spinners";

function AddUserModal({ isOpen, onClose, selectedUser, setRefreshKey }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        title: "",
        initials: "",
        role: "",
        designation: [],
        profileImage: null
    });

    const [errors, setErrors] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFormData({
                ...formData,
                profileImage: file
            });

            setImagePreview(URL.createObjectURL(file));
        }
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });


        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        let newErrors = {};


        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }


        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Invalid email format";
            }
        }


        if (formData.phone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = "Phone number must be exactly 10 digits";
            }
        }


        if (!formData.role) {
            newErrors.role = "Role is required";
        }


        if (formData.designation.length === 0) {
            newErrors.designation = "At least one designation must be selected";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        console.log("New User:", formData);

        const submitData = new FormData();

        submitData.append("name", formData.name);
        submitData.append("email", formData.email);
        submitData.append("phone", formData.phone);
        submitData.append("title", formData.title);
        submitData.append("initials", formData.initials);
        submitData.append("role", formData.role);

        // formData.designation.forEach((item, index) => {
        //     submitData.append(`designation[${index}]`, item);
        // });

        // if (formData.profileImage) {
        //     submitData.append("user_picture", formData.profileImage);
        // }
        setLoading(true);

        Api.post('api/user', submitData, {
            Authorization: `Bearer ${token}`
        })
            .then(response => {
                setLoading(false)
                if (response.status === 200) {
                    console.log("User added successfully:", response.data);
                    setRefreshKey(prev => prev + 1);
                    setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        title: "",
                        initials: "",
                        role: "",
                        designation: [],
                        profileImage: null
                    });

                    setProfileImage(null);
                    setImagePreview(null);
                    setErrors({});
                    onClose();
                } else {
                    console.error("Failed to add user:", response);
                    alert("Failed to add user, please try again.")
                }
            })


    };

    const handleUpdate = () => {
        if (!validateForm()) return;

        // console.log("update User:", formData);
        // console.log("Selected User for Update:", selectedUser);

        setLoading(true);

        Api.post(`api/user/${selectedUser.id}`, {
            name: formData.name,
            email: formData.email,
            title: formData.title,
            initials: formData.initials,
            phone: formData.phone,
            _method: "put",
            role: formData.role
        }, {
            Authorization: `Bearer ${token}`
        })
            .then(response => {
                setLoading(false);
                if (response.status === 200) {
                    console.log("User update resp:", response);
                    setRefreshKey(prev => prev + 1);
                } else {
                    console.error("Failed to update user:", response);
                    alert("Failed to update user. Please try again.");
                }

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    title: "",
                    initials: "",
                    role: "",
                    designation: [],
                    profileImage: null
                });

                setProfileImage(null);
                setImagePreview(null);
                setErrors({});
                onClose();

            })
    }

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            title: "",
            initials: "",
            role: "",
            designation: [],
            profileImage: null
        });
        setProfileImage(null);
        setImagePreview(null);
        setErrors({});
        onClose();
    };

    useEffect(() => {
        Api.post('api/role/dropdown', {
            id: "",
            type: '0'
        }, {
            Authorization: `Bearer ${token}`
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Roles List:", response.data.data);
                    setRoles(response.data.data);
                } else {
                    console.error("Failed to fetch roles:", response);
                }
            })
    }, [])


    useEffect(() => {
        if (selectedUser) {
            console.log("Selected User for Editing:", selectedUser);
            setFormData({
                name: selectedUser.first_name || "",
                email: selectedUser.email || "",
                phone: selectedUser.phone || "",
                title: selectedUser.title || "",
                initials: selectedUser.initials || "",
                role: selectedUser.role.id || "",
                designation: selectedUser.designation || []
            });
        }
    }, [selectedUser]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white w-[700px] rounded-xl p-6 relative">

                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-xl"
                >
                    ×
                </button>

                <h2 className="text-xl font-semibold mb-6">Add New User</h2>


                <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                        <img
                            src={imagePreview || defaultProfImage}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                        />

                    </div>

                    <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200">
                        Upload Profile Picture
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>


                <div className="grid grid-cols-2 gap-x-4 gap-y-6">


                    <div className="text-left">
                        <label className="text-sm">
                            Name<span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full mt-1 bg-gray-100 p-2 rounded-md outline-none"
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>


                    <div className="text-left">
                        <label className="text-sm">
                            Email<span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-1 bg-gray-100 p-2 rounded-md outline-none"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>


                    <div className="text-left">
                        <label className="text-sm">Phone Number</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full mt-1 bg-gray-100 p-2 rounded-md outline-none"
                            placeholder="Enter phone number"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>


                    <div className="text-left">
                        <label className="text-sm">Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full mt-1 bg-gray-100 p-2 rounded-md outline-none"
                            placeholder="Enter title"
                        />
                    </div>


                    <div className="text-left">
                        <label className="text-sm">Initials</label>
                        <input
                            name="initials"
                            value={formData.initials}
                            onChange={handleChange}
                            className="w-full mt-1 bg-gray-100 p-2 rounded-md outline-none"
                            placeholder="Enter initials"
                        />
                    </div>


                    <div className="text-left">
                        <label className="text-sm">
                            Role<span className="text-red-500 font-bold">*</span>
                        </label>
                        {/* <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full mt-1 bg-gray-100 p-2 rounded-md outline-none"
                        >
                            <option value="">Select role</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                        </select> */}

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full mt-1 bg-gray-100 p-2 rounded-md outline-none"
                        >
                            <option value="">Select role</option>

                            {Object.entries(roles).map(([roleName, roleId]) => (
                                <option key={roleId} value={roleId}>
                                    {roleName}
                                </option>
                            ))}
                        </select>



                        {errors.role && (
                            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                        )}
                    </div>



                </div>


                <div className="text-left mt-6">
                    <label className="text-sm font-medium">
                        Designation<span className="text-red-500 font-bold">*</span>
                    </label>

                    <div className="flex gap-8 mt-3">
                        {["Designer", "Project Manager", "Production Manager", "Sales Rep"].map((item) => (
                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.designation.includes(item)}
                                    onChange={(e) => {
                                        const { checked, value } = e.target;

                                        if (checked) {
                                            setFormData({
                                                ...formData,
                                                designation: [...formData.designation, value],
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                designation: formData.designation.filter(
                                                    (d) => d !== value
                                                ),
                                            });
                                        }

                                        setErrors({ ...errors, designation: "" });
                                    }}
                                    className="w-4 h-4 accent-[#8570FF]"
                                />
                                <span className="text-sm">{item}</span>
                            </label>
                        ))}
                    </div>

                    {errors.designation && (
                        <p className="text-red-500 text-xs mt-2">{errors.designation}</p>
                    )}
                </div>

                <div
                    onClick={selectedUser ? handleUpdate : handleSubmit}
                    className="mt-10 w-full bg-[#413c5a] hover:bg-[#23202f] text-white py-2 rounded-md cursor-pointer"
                >
                    {selectedUser ? "Update User" : "Add New User"}
                </div>

            </div>

            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="flex items-center justify-center gap-4 bg-white w-auto p-10  shadow-lg">
                        <ClipLoader
                            color={'#413c5a'}
                            loading={true}
                            size={32}
                            aria-label="Loading Spinner"
                            data-testid="Loader"
                        />
                        <div> Loading.. Please wait !</div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AddUserModal;
