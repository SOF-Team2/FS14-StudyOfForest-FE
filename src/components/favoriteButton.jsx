import { useState } from "react";
import axios from "../utils/axios";

const USER_ID = "942d8758-939d-47f4-ba70-f418cccbdfd4";

function FavoriteButton({
  studyId,
  isFavorite,
  onFavoriteChange,
  isPreview = false,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading || isPreview) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `/api/favorites/${studyId}`,
        {},
        {
          headers: {
            "x-user-id": USER_ID,
          },
        },
      );

      onFavoriteChange?.(studyId, response.data.data.isFavorite);
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`favorite-btn ${isFavorite ? "active" : ""} ${
        isPreview ? "is-preview" : ""
      }`}
      onClick={handleToggle}
      disabled={isLoading}
      tabIndex={isPreview ? -1 : undefined}
      aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={isFavorite}
      aria-hidden={isPreview || undefined}
    >
      <svg
        className="heart-icon"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

export default FavoriteButton;
