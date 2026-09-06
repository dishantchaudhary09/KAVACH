import React from "react";
import { Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../Redux/Citizen Slices/themeSlice.js";

const ThemeToggle = () => {
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleDarkMode())}
      className={`
        fixed
        right-5
        top-5
        z-[100]
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        shadow-lg
        backdrop-blur-md
        transition-all
        duration-300

        ${
          darkMode
            ? "border-white/10 bg-white/10 text-yellow-300 hover:bg-white/20"
            : "border-gray-200 bg-white text-slate-700 hover:bg-gray-100"
        }
      `}
      aria-label="Toggle dark mode"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
};

export default ThemeToggle;
