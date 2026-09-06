import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserRound, Mountain, ArrowRight } from "lucide-react";
import ThemeToggle from "../../Component/Citizen Component/ThemeToggle.jsx";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/citizen/login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 dark:bg-slate-100 flex items-center justify-center p-2 sm:p-4">
      <ThemeToggle />
      {/* Main Background */}
      <div
        className="
          relative
          w-full
          max-w-[1400px]
          min-h-[calc(100vh-16px)]
          sm:min-h-[calc(100vh-32px)]
          overflow-hidden
          rounded-lg
          bg-cover
          bg-center
          flex
          flex-col
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/50" />

        {/* Top Badge */}
        <div className="relative z-10 flex justify-center pt-1 sm:pt-2">
          <div
            className="
              rounded-b-md bg-slate-900/95
              px-5 py-1.5 sm:px-8 sm:py-2
              shadow-lg
            "
          >
            <h1 className="text-[11px] sm:text-sm md:text-base font-bold text-white tracking-wide">
              LANDSLIDES RISK MONOTRING SYSTEM
            </h1>
          </div>
        </div>

        {/* Header */}
        <header
          className="
            relative
            z-10
            px-5
            pt-8
            sm:px-10
            sm:pt-12
            md:px-16
          "
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mountain Logo */}
            <div
              className="
                w-12
                h-12
                sm:w-16
                sm:h-16
                rounded-xl
                bg-white/10
                backdrop-blur-md
                border
                border-white/20
                flex
                items-center
                justify-center
              "
            >
              <Mountain
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                strokeWidth={1.5}
              />
            </div>

            {/* System Name */}
            <div className="text-white">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                Landslide Risk
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-200">
                Monitoring System
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="
            relative
            z-10
            flex-1
            flex
            items-center
            justify-center
            px-4
            py-10
          "
        >
          <div className="w-full max-w-2xl">
            {/* Heading */}
            <div className="text-center text-white mb-7 sm:mb-9">
              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  font-bold
                  tracking-tight
                "
              >
                Welcome
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  sm:text-sm
                  md:text-base
                  text-gray-200
                "
              >
                Select your role to continue
              </p>
            </div>

            {/* Role Cards */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
                sm:gap-6
              "
            >
              {/* ADMIN */}
              <button
                onClick={() => handleRoleSelect("admin")}
                className="
                  group
                  text-left
                  bg-white/95 dark:bg-slate-900/95
                  backdrop-blur-md
                  rounded-xl
                  p-5
                  sm:p-6
                  md:p-7
                  shadow-2xl
                  border
                  border-white/40
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white dark:hover:bg-slate-800
                  hover:shadow-blue-900/30
                "
              >
                {/* Icon */}
                <div
                  className="
                    w-14
                    h-14
                    sm:w-16
                    sm:h-16
                    rounded-xl
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                    mb-5
                    group-hover:bg-blue-600
                    transition-colors
                  "
                >
                  <ShieldCheck
                    className="
                      w-8
                      h-8
                      text-blue-600
                      group-hover:text-white
                      transition-colors
                    "
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Admin
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        sm:text-sm
                        text-gray-500
                        leading-relaxed
                      "
                    >
                      For government officials and system administrators.
                    </p>
                  </div>

                  <ArrowRight
                    className="
                      w-5
                      h-5
                      text-gray-400
                      group-hover:text-blue-600
                      group-hover:translate-x-1
                      transition-all
                    "
                  />
                </div>

                <div
                  className="
                    mt-5
                    inline-flex
                    items-center
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1
                    text-[10px]
                    font-semibold
                    text-blue-600
                  "
                >
                  ADMIN ACCESS
                </div>
              </button>

              {/* CITIZEN */}
              <button
                onClick={() => handleRoleSelect("citizen")}
                className="
                  group
                  text-left
                  bg-white/95 dark:bg-slate-900/95
                  backdrop-blur-md
                  rounded-xl
                  p-5
                  sm:p-6
                  md:p-7
                  shadow-2xl
                  border
                  border-white/40
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white dark:hover:bg-slate-800
                  hover:shadow-green-900/30
                "
              >
                {/* Icon */}
                <div
                  className="
                    w-14
                    h-14
                    sm:w-16
                    sm:h-16
                    rounded-xl
                    bg-green-100
                    flex
                    items-center
                    justify-center
                    mb-5
                    group-hover:bg-green-600
                    transition-colors
                  "
                >
                  <UserRound
                    className="
                      w-8
                      h-8
                      text-green-600
                      group-hover:text-white
                      transition-colors
                    "
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Citizen
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        sm:text-sm
                        text-gray-500
                        leading-relaxed
                      "
                    >
                      For citizens to report hazards, view <br /> alerts and
                      stay informed.
                    </p>
                  </div>

                  <ArrowRight
                    className="
                      w-5
                      h-5
                      text-gray-400
                      group-hover:text-green-600
                      group-hover:translate-x-1
                      transition-all
                    "
                  />
                </div>

                <div
                  className="
                    mt-5
                    inline-flex
                    items-center
                    rounded-full
                    bg-green-50
                    px-3
                    py-1
                    text-[10px]
                    font-semibold
                    text-green-600
                  "
                >
                  CITIZEN ACCESS
                </div>
              </button>
            </div>

            {/* Bottom Text */}
            <p
              className="
                text-center
                text-[10px]
                sm:text-xs
                text-gray-200
                mt-6
              "
            >
              Choose the account type that matches your role
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="
            relative
            z-10
            h-10
            sm:h-11
            bg-slate-950/85
            flex
            items-center
            justify-center
            text-[8px]
            sm:text-[10px]
            text-gray-300
          "
        >
          © 2026 Landslide Risk Monitoring System
        </footer>
      </div>
    </div>
  );
};

export default RoleSelection;
