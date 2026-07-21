// 로그인한 사용자의 ID를 localStorage에 저장/조회/삭제하는 유틸 함수
// 로그인 시 저장 → 이후 요청에서 x-user-id 헤더로 전달할 때 사용 → 로그아웃 시 삭제
const USER_ID_KEY = "userId";

export const saveUserId = (userId) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

export const removeUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};