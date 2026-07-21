import { useEffect, useState, useRef } from "react";

import searchIcon from "../../assets/img/ic_search.svg";
import arrowIcon from "../../assets/img/ic_toggle.svg";

const SORT_OPTIONS = [
  { value: "latest", label: "최근 순" },
  { value: "oldest", label: "오래된 순" },
  { value: "points_desc", label: "많은 포인트 순" },
  { value: "points_asc", label: "적은 포인트 순" },
];

function SearchSortBar({
  keyword,
  onKeywordChange,
  sortValue,
  onSortChange,
  suggestions = [],
  isSearching = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
        setActiveSuggestionIndex(-1);
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

  const isSuggestionOpen = isSearchFocused && keyword.trim().length > 0;

  const handleSuggestionSelect = (suggestion) => {
    onKeywordChange(suggestion.name);
    setIsSearchFocused(false);
    setActiveSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchFocused(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (suggestions.length === 0) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
      );
    }

    if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[activeSuggestionIndex]);
    }
  };

  return (
    <div className="search_sort_wrap">
      <div className="search_autocomplete" ref={searchRef}>
        <div className="search_box">
          <span className="search_icon">
            <img src={searchIcon} alt=""></img>
          </span>
          <input
            type="text"
            placeholder="검색"
            value={keyword}
            autoComplete="off"
            role="combobox"
            aria-label="스터디 검색"
            aria-autocomplete="list"
            aria-expanded={isSuggestionOpen}
            aria-controls="study-search-suggestions"
            aria-activedescendant={
              activeSuggestionIndex >= 0
                ? `study-search-suggestion-${activeSuggestionIndex}`
                : undefined
            }
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              onKeywordChange(e.target.value);
              setIsSearchFocused(true);
              setActiveSuggestionIndex(-1);
            }}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {isSuggestionOpen && (
          <ul
            className="search_suggestion_menu"
            id="study-search-suggestions"
            role="listbox"
          >
            {isSearching ? (
              <li className="search_suggestion_state">연관 검색어를 찾는 중입니다.</li>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li
                  id={`study-search-suggestion-${index}`}
                  key={suggestion.id ?? `${suggestion.name}-${index}`}
                  role="option"
                  aria-selected={activeSuggestionIndex === index}
                >
                  <button
                    type="button"
                    className={
                      activeSuggestionIndex === index ? "is-active" : ""
                    }
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <span className="search_suggestion_name">{suggestion.name}</span>
                    {suggestion.nickname && (
                      <span className="search_suggestion_nickname">
                        {suggestion.nickname}
                      </span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="search_suggestion_state">연관 검색어가 없습니다.</li>
            )}
          </ul>
        )}
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
