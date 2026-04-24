import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRegisterUserMutation } from "../../redux/features/auth/authAPI";
import Loading from "../../Component/Loading";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = { username, email, password };

    try {
      await registerUser(data).unwrap();
      alert("Registration successful! Please login.");
      navigate("/log-in");
    } catch (err) {
      setMessage(err.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-outfit relative flex flex-col">
      {/* Top Navigation - Mobile First */}
      <div className="p-4 md:p-8 flex justify-between items-center z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-600 hover:border-orange-100 hover:shadow-lg transition-all group"
        >
          <IoArrowBackOutline
            className="group-hover:-translate-x-1 transition-transform"
            size={14}
          />
          <span className="hidden sm:inline">{t("backToHome")}</span>
        </Link>
        <img src="/Logo.png" alt="Logo" className="h-6 md:h-8 block md:hidden" />
      </div>

      <div className="flex-grow flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[480px] relative z-10">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 p-8 md:p-12">
            <div className="text-center mb-10">
              <img src="/Logo.png" alt="Logo" className="h-8 md:h-10 mx-auto mb-6 hidden md:block" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">
                {t("registerTitle")}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                {t("combatSportsAuthority")}
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  {t("usernamePlaceholder")}
                </label>
                <input
                  type="text"
                  value={username}
                  className="w-full px-6 py-4 md:py-4.5 bg-gray-50/50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-600/5 focus:bg-white focus:border-orange-600/10 transition-all outline-none text-sm font-bold text-gray-900 placeholder:text-gray-200"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="TheTiger99"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  {t("emailPlaceholder")}
                </label>
                <input
                  type="email"
                  value={email}
                  className="w-full px-6 py-4 md:py-4.5 bg-gray-50/50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-600/5 focus:bg-white focus:border-orange-600/10 transition-all outline-none text-sm font-bold text-gray-900 placeholder:text-gray-200"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  {t("passwordPlaceholder")}
                </label>
                <input
                  type="password"
                  value={password}
                  className="w-full px-6 py-4 md:py-4.5 bg-gray-50/50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-600/5 focus:bg-white focus:border-orange-600/10 transition-all outline-none text-sm font-bold text-gray-900 placeholder:text-gray-200"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {message && (
                <div className={`text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center border ${message.includes("success") ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-orange-600 text-white py-4.5 md:py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-gray-200 hover:shadow-orange-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <Loading isSmall={true} /> : t("registerButton")}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                {t("alreadyHaveAccount")}{" "}
                <Link
                  to="/log-in"
                  className="text-orange-600 hover:text-gray-900 transition-colors block sm:inline mt-1 sm:mt-0"
                >
                  {t("loginButton")}
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            © {new Date().getFullYear()} Combat Corner
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
