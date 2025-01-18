import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { getUserPlatform } from "../utils/getUserPlatform";
import { useNavigate } from "react-router-dom";
import { setLocalStorage } from "../utils/setLocalStorage";
import { AppContext } from "../context/AppContext";
import { getLocalStorage } from "../utils/getLocalStorage";
import axiosInstance from "../api/axiosInstance";
import { useLoggerStore } from "@store/log.jsx";
import LoaderComponent from "../components/common/LoaderComponent";
import { EyeClosed, Eye, Lock, UserPlus } from 'lucide-react';
import useStore from "@store";
import logo from "../../public/logo.png"
import minor from "../../public/minor.png"

const LoginPage = () => {
  const { setActiveUserData, activeUserData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    whatsAppNumber: "",
    password: "",
  });
  const [userPlatform, setUserPlatform] = useState(null);
  const [loaderActive, setLoaderActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updateActivityLog, initializeLogData } = useLoggerStore();

  useEffect(() => {
    initializeLogData(activeUserData);
  }, [activeUserData, initializeLogData]);

  useEffect(() => {
    setUserPlatform(getUserPlatform());
    try {
      if (getLocalStorage()) {
        window.location.href = "/";
      }
    } catch (error) {}
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "whatsAppNumber" && value.length > 10) return;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    setLoaderActive(true);
    const regex = /^[6-9]\d{9}$/;

    if (!formData.password) {
      toast.error("Please enter password");
      setLoaderActive(false);
      return;
    }

    try {
      const res = await axiosInstance("/session", "POST", {
        number: formData.whatsAppNumber,
        password: formData.password,
        platform: userPlatform
      });

      setActiveUserData({
        user_name: res?.data?.data?.user_name,
        user_id: res?.data?.data?.user_id,
        user_position: res?.data?.data?.user_role,
      });

      setLocalStorage(
        res?.data?.data?.access_token,
        res?.data?.data?.access_token_expiry,
        res?.data?.data?.refresh_token,
        res?.data?.data?.refresh_token_expiry,
        res?.data?.data?.session_id,
        res?.data?.data?.user_role
      );
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.messages[0] || "Login failed");
    } finally {
      setLoaderActive(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-6 py-10">
      {loaderActive && <LoaderComponent />}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2 items-center">
            <h2 className="text-xl flex justify-center gap-1 font-bold text-[#0052CC]">
            <img src={minor} alt="logo" className="w-[25px] mt-1  h-[20px]" /> Login
            </h2>
            <p className="text-sm text-gray-600">
              Please enter your credentials to continue
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <UserPlus className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  type="text"
                  placeholder="Username"
                  name="whatsAppNumber"
                  maxLength={10}
                  value={formData.whatsAppNumber}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;