import React from "react";
import { Menu, Sun, Moon, ShieldCheck, Bell, UserCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleDarkMode } from "../../Redux/Citizen Slices/themeSlice";

const AdminNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        h-[68px]
        border-b
        transition-colors
        duration-300
        ${
          darkMode
            ? "bg-[#0b1c15] border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }
      `}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* ================= LEFT ================= */}

        <div className="flex items-center gap-3">
          {/* Menu Button */}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
            className={`
              rounded-lg
              p-2
              transition
              ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}
            `}
          >
            <Menu size={21} />
          </button>

          {/* Logo */}

          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-green-600
                shadow-lg
                shadow-green-900/20
              "
            >
              <ShieldCheck size={23} className="text-white" />
            </div>

            <div className="leading-tight">
              <h1 className="text-sm font-bold sm:text-base">Landslide Risk</h1>

              <p
                className={`
                  text-[9px] sm:text-[10px]
                  ${darkMode ? "text-gray-400" : "text-gray-500"}
                `}
              >
                Admin Monitoring System
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex items-center gap-2 sm:gap-4">
          {/* ================= SYSTEM STATUS ================= */}

          <div className="hidden items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>

            <span className="text-[10px] font-semibold text-green-500">
              System Online
            </span>
          </div>

          {/* ================= NOTIFICATION ================= */}

          <button
            onClick={() => navigate("/admin/alerts")}
            title="Alerts"
            className={`
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              transition
              ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}
            `}
          >
            <Bell size={19} />

            {/* Notification Badge */}

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* ================= DARK MODE ================= */}

          <button
            onClick={() => dispatch(toggleDarkMode())}
            title="Toggle Dark Mode"
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              transition
              ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>

          {/* ================= ADMIN PROFILE ================= */}

          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right">
              <p className="text-xs font-semibold">Admin</p>

              <p
                className={`
                  text-[9px]
                  ${darkMode ? "text-gray-500" : "text-gray-400"}
                `}
              >
                Administrator
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white">
              <UserCircle size={21} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
