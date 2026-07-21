import { useEffect, useState } from "react";

function DarkModeButton() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);

    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <button
      className={`dark_mode_btn ${isDarkMode ? "active" : ""}`}
      onClick={() => setIsDarkMode((prev) => !prev)}
      aria-label="다크모드"
    >
      <div className="dark_mode_thumb">
        <span>{isDarkMode ? "🌙" : "☀️"}</span>
      </div>
    </button>
  );
}

export default DarkModeButton;
