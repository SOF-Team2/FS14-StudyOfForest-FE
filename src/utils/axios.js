import Axios from 'axios';
import { getUserId } from './authStorage.js';

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// API 요청이 백엔드로 전송되기 직전에 실행되는 요청 인터셉터
axios.interceptors.request.use(
  (config) => {
    // localStorage에 저장된 로그인 사용자 ID 조회
    const userId = getUserId();

    // 로그인된 사용자가 있을 때만 x-user-id 헤더 추가
    // 로그인·회원가입처럼 사용자 ID가 아직 없는 요청에는 헤더가 추가되지 않음
    if (userId) {
      config.headers['x-user-id'] = userId;
    }

    // 수정된 요청 설정을 반환해야 실제 API 요청이 계속 진행됨
    return config;
  },
  (error) => {
    // 요청을 보내기 전에 오류가 발생하면 호출한 곳의 catch로 전달
    return Promise.reject(error);
  },
);

export default axios;