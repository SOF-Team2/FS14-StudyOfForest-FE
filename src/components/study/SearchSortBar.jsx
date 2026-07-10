import { useEffect, useState, useRef } from "react";

import searchIcon from "../../assets/img/ic_search.svg";
import arrowIcon from "../../assets/img/ic_toggle.svg";

const SORT_OPTIONS = [
  { value: "latest", label: "최근 순" },
  { value: "oldest", label: "오래된 순" },
  { value: "points_desc", label: "많은 포인트 순" },
  { value: "points_asc", label: "적은 포인트 순" },
];

function SearchSortBar({ keyword, onKeywordChange, sortValue, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortValue)?.label || "최근 순";

  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="search_sort_wrap">
      <div className="search_box">
        <span className="search_icon">
          <img src={searchIcon} alt="검색"></img>
        </span>
        <input
          type="text"
          placeholder="검색"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>
      <div className="sort_dropdown" ref={dropdownRef}>
        <button
          type="button"
          className="sort_toggle"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {currentLabel}
          <img
            src={arrowIcon}
            alt="정렬버튼"
            className={`arrow ${isOpen ? "open" : ""}`}
          />
        </button>

        {isOpen && (
          <ul className="sort_menu">
            {SORT_OPTIONS.map((opt) => (
              <li
                key={opt.value}
                className={opt.value === sortValue ? "active" : ""}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchSortBar;
