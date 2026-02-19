import React, { useState } from "react";
import backgroundImage from "../assets/bgimage.png";
import { useNavigate } from "react-router-dom";
import Api from "../services/Api";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loginLoading, setLoginLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

  
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

  
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

 
    const validate = () => {
        let newErrors = {};

  
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

    
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 4) {
            newErrors.password = "Password must be at least 4 characters";
        }

        return newErrors;
    };

  
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoginLoading(true);
        Api.post('api/login', {
            email: formData.email,
            password: formData.password,
            ip_address: "220.233.36.40"
        })
        .then((response)=>{
            setLoginLoading(false);
            if(response.status === 200){
                console.log("Login Response:", response.data.access_token);
                localStorage.setItem("token", response.data.access_token);
                navigate("/users");
                window.location.reload();
            } else {
                console.error("Login failed:", response);
                alert("Login failed. Please check your credentials and try again.");
            }
           
        })
 
    };

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="w-[402px] h-[378px] bg-white shadow-lg rounded-xl p-8 flex flex-col justify-center">

                <h1 className="text-2xl font-semibold text-center">
                    Sign In
                </h1>

                <p className="text-sm text-gray-500 text-center mt-2">
                    Login to manage your account
                </p>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">

              
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                  
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div
                        onClick={handleSubmit}
                        className="mt-4 bg-blue-600 cursor-pointer text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        {loginLoading ? "Logging in..." : "Login"}
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;
