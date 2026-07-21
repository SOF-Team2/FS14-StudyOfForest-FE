import React, { useState } from 'react';
import axios from '../utils/axios';

const FavoriteButton = ({ studyId, initialIsFavorite = false, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e) => {
  e.stopPropagation();

  if (isLoading) return;

  const previousState = isFavorite;
  setIsFavorite(!previousState);
  setIsLoading(true);

  try {
    // ✅ axios.post(URL, bodyData, config)
    // 보낼 body 데이터가 없더라도 빈 객체({})를 2번째 인자로 전달해야 3번째 인자에 headers가 적용됩니다.
    const response = await axios.post(
      `/api/favorites/${studyId}`,
      {}, 
      {
        headers: {
          "x-user-id": "942d8758-939d-47f4-ba70-f418cccbdfd4",
        },
      }
    );

    // ✅ response.data에서 백엔드가 보내준 응답 데이터 바로 추출
    const updatedStatus = response.data.data.isFavorite;

    setIsFavorite(updatedStatus);

    if (onToggle) {
      onToggle(updatedStatus);
    }
  } catch (error) {
    console.error('즐겨찾기 토글 중 에러:', error);
    // 실패 시 이전 상태로 롤백
    setIsFavorite(previousState);
    alert('처리에 실패했습니다. 다시 시도해 주세요.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <button
      type="button"
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <svg
        className="heart-icon"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default FavoriteButton;