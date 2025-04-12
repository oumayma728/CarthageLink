import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { DarkModeContext } from "../contexts/DarkModeContext.js";
import { useContext } from "react";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};
export default ThemeToggle;
