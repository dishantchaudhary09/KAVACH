import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Eye,
  X,
  Mail,
  Calendar,
  MapPin,
  MoreVertical,
} from "lucide-react";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

const AdminUsers = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: "USR-001",
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      role: "Citizen",
      status: "Active",
      location: "Aizawl, Mizoram",
      joined: "12 April 2026",
      reports: 5,
    },
    {
      id: "USR-002",
      name: "Priya Singh",
      email: "priya@gmail.com",
      role: "Citizen",
      status: "Active",
      location: "Kohima, Nagaland",
      joined: "18 April 2026",
      reports: 3,
    },
    {
      id: "USR-003",
      name: "Amit Kumar",
      email: "amit@gmail.com",
      role: "Citizen",
      status: "Inactive",
      location: "Gangtok, Sikkim",
      joined: "22 April 2026",
      reports: 7,
    },
    {
      id: "USR-004",
      name: "Admin User",
      email: "admin@landslide.com",
      role: "Admin",
      status: "Active",
      location: "Shillong, Meghalaya",
      joined: "01 April 2026",
      reports: 0,
    },
    {
      id: "USR-005",
      name: "Neha Verma",
      email: "neha@gmail.com",
      role: "Citizen",
      status: "Active",
      location: "Imphal, Manipur",
      joined: "25 April 2026",
      reports: 2,
    },
    {
      id: "USR-006",
      name: "Rohit Das",
      email: "rohit@gmail.com",
      role: "Citizen",
      status: "Inactive",
      location: "Itanagar, Arunachal Pradesh",
      joined: "28 April 2026",
      reports: 1,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesFilter =
      filter === "All" || user.status === filter || user.role === filter;

    const text = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text) ||
      user.location.toLowerCase().includes(text) ||
      user.id.toLowerCase().includes(text);

    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* ================= NAVBAR ================= */}

      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ================= MAIN ================= */}

      <main className="pt-[68px] lg:ml-[250px]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {/* ================= HEADER ================= */}

          <div className="mb-5">
            <div className="flex items-center gap-2">
              <Users size={24} className="text-blue-500" />

              <h1 className="text-xl font-bold sm:text-2xl">User Management</h1>
            </div>

            <p
              className={`mt-1 text-xs sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Manage registered citizens and administrator accounts.
            </p>
          </div>

          {/* ================= STATS ================= */}

          <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <UserStat
              icon={<Users />}
              value="1,248"
              title="Total Users"
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              darkMode={darkMode}
            />

            <UserStat
              icon={<UserCheck />}
              value="1,185"
              title="Active Users"
              iconColor="text-green-500"
              iconBg="bg-green-500/10"
              darkMode={darkMode}
            />

            <UserStat
              icon={<UserX />}
              value="63"
              title="Inactive Users"
              iconColor="text-orange-500"
              iconBg="bg-orange-500/10"
              darkMode={darkMode}
            />

            <UserStat
              icon={<ShieldCheck />}
              value="12"
              title="Administrators"
              iconColor="text-purple-500"
              iconBg="bg-purple-500/10"
              darkMode={darkMode}
            />
          </div>

          {/* ================= USERS PANEL ================= */}

          <section
            className={`rounded-2xl border shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* SEARCH + FILTER */}

            <div
              className={`border-b p-4 ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* SEARCH */}

                <div className="relative w-full lg:max-w-[350px]">
                  <Search
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className={`
                      h-10
                      w-full
                      rounded-xl
                      border
                      pl-9
                      pr-3
                      text-xs
                      outline-none
                      focus:border-blue-500

                      ${
                        darkMode
                          ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                          : "border-slate-200 bg-slate-50 text-slate-900"
                      }
                    `}
                  />
                </div>

                {/* FILTER */}

                <div className="flex gap-2 overflow-x-auto">
                  {["All", "Citizen", "Admin", "Active", "Inactive"].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`
                        whitespace-nowrap
                        rounded-lg
                        px-3
                        py-2
                        text-[10px]
                        font-semibold
                        transition

                        ${
                          filter === item
                            ? "bg-blue-600 text-white"
                            : darkMode
                              ? "bg-[#07140f] text-slate-400 hover:bg-[#143326] hover:text-white"
                              : "bg-slate-100 text-slate-500 hover:text-slate-900"
                        }
                      `}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* ================= USERS LIST ================= */}

            <div className="p-4">
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div
                    className={`rounded-xl border py-12 text-center ${
                      darkMode
                        ? "border-white/10 bg-[#07140f]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <Users size={35} className="mx-auto text-slate-400" />

                    <p className="mt-3 text-sm font-semibold">No users found</p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filter.
                    </p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`
                        rounded-xl
                        border
                        p-4
                        transition
                        hover:shadow-md

                        ${
                          darkMode
                            ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
                            : "border-slate-200 bg-slate-50 hover:bg-white"
                        }
                      `}
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                        {/* USER */}

                        <div className="flex min-w-0 flex-1 gap-3">
                          {/* AVATAR */}

                          <div
                            className={`
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              font-bold

                              ${
                                user.role === "Admin"
                                  ? "bg-purple-500/10 text-purple-500"
                                  : "bg-blue-500/10 text-blue-500"
                              }
                            `}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          {/* DETAILS */}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold">{user.name}</h3>

                              <span
                                className={`
                                  rounded-full
                                  border
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-bold

                                  ${
                                    user.role === "Admin"
                                      ? "border-purple-500/20 bg-purple-500/10 text-purple-500"
                                      : "border-blue-500/20 bg-blue-500/10 text-blue-500"
                                  }
                                `}
                              >
                                {user.role}
                              </span>

                              <span
                                className={`
                                  rounded-full
                                  border
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-bold

                                  ${
                                    user.status === "Active"
                                      ? "border-green-500/20 bg-green-500/10 text-green-500"
                                      : "border-orange-500/20 bg-orange-500/10 text-orange-500"
                                  }
                                `}
                              >
                                {user.status}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-4">
                              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                <Mail size={12} />
                                {user.email}
                              </span>

                              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                <MapPin size={12} />
                                {user.location}
                              </span>

                              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                <Calendar size={12} />
                                Joined {user.joined}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT */}

                        <div className="flex items-center justify-between gap-5 xl:justify-end">
                          <div>
                            <p className="text-[9px] text-slate-400">Reports</p>

                            <p className="mt-1 text-xs font-bold">
                              {user.reports}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] text-slate-400">User ID</p>

                            <p className="mt-1 text-xs font-bold">{user.id}</p>
                          </div>

                          <button
                            onClick={() => setSelectedUser(user)}
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-500/10
                              text-blue-500
                              transition
                              hover:bg-blue-500/20
                            "
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            className={`
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg

                              ${
                                darkMode
                                  ? "bg-[#07140f] text-slate-400 hover:bg-[#143326] hover:text-white"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                              }
                            `}
                          >
                            <MoreVertical size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ================= USER DETAILS MODAL ================= */}

      {selectedUser && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className={`
              w-full
              max-w-lg
              rounded-2xl
              border
              p-5
              shadow-2xl

              ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    font-bold

                    ${
                      selectedUser.role === "Admin"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-blue-500/10 text-blue-500"
                    }
                  `}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-lg font-bold">{selectedUser.name}</h2>

                  <p className="text-[10px] text-slate-400">
                    {selectedUser.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg

                  ${
                    darkMode
                      ? "bg-[#07140f] hover:bg-[#143326]"
                      : "bg-slate-100 hover:bg-slate-200"
                  }
                `}
              >
                <X size={17} />
              </button>
            </div>

            {/* DETAILS */}

            <div className="mt-6 grid grid-cols-2 gap-5">
              <UserDetail label="Email" value={selectedUser.email} />

              <UserDetail label="Role" value={selectedUser.role} />

              <UserDetail label="Status" value={selectedUser.status} />

              <UserDetail label="Location" value={selectedUser.location} />

              <UserDetail label="Joined" value={selectedUser.joined} />

              <UserDetail
                label="Reports Submitted"
                value={selectedUser.reports}
              />
            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex gap-2">
              {selectedUser.status === "Active" ? (
                <button
                  className="
                    flex-1
                    rounded-lg
                    bg-orange-600
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-orange-700
                  "
                >
                  Deactivate User
                </button>
              ) : (
                <button
                  className="
                    flex-1
                    rounded-lg
                    bg-green-600
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-green-700
                  "
                >
                  Activate User
                </button>
              )}

              <button
                className="
                  flex-1
                  rounded-lg
                  bg-red-600
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  hover:bg-red-700
                "
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STAT ================= */

const UserStat = ({ icon, value, title, iconColor, iconBg, darkMode }) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-4
        shadow-xl

        ${
          darkMode
            ? "border-white/10 bg-[#0f241b]"
            : "border-slate-200 bg-white"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            ${iconBg}
            ${iconColor}
          `}
        >
          {icon}
        </div>

        <div>
          <p className="text-xl font-bold">{value}</p>

          <p className="text-[10px] text-slate-400">{title}</p>
        </div>
      </div>
    </div>
  );
};

/* ================= USER DETAIL ================= */

const UserDetail = ({ label, value }) => {
  return (
    <div>
      <p className="text-[10px] text-slate-400">{label}</p>

      <p className="mt-1 break-words text-xs font-semibold">{value}</p>
    </div>
  );
};

export default AdminUsers;
