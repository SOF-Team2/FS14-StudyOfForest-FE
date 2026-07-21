import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAlert from "../components/useAlert.js";
import { useLoading } from "../contexts/LoadingContext.jsx";
import axios from "../utils/axios.js";
import logoImage from "../assets/img/logo.png";

function SignUpPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  // 비밀번호가 올바르게 반복 입력됐는지 확인하기 위한 값
  // 백엔드 API에는 전송하지 않고 프론트에서만 비교
  const [confirmPassword, setConfirmPassword] = useState("");

  // 화면에 표시될 사용자 닉네임 입력값
  const [nickname, setNickname] = useState("");

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { startLoading, endLoading } = useLoading();

  // 회원가입 입력값을 검사하고 회원가입 API를 요청하는 함수
  const handleSignup = async (event) => {
    // form 제출 시 브라우저가 새로고침되는 기본 동작을 막음
    event.preventDefault();

    // 아이디와 닉네임 앞뒤의 불필요한 공백을 제거
    const trimmedLoginId = loginId.trim();
    const trimmedNickname = nickname.trim();

    // 회원가입에 필요한 모든 입력값이 작성됐는지 확인
    if (
      !trimmedLoginId
      || !password
      || !confirmPassword
      || !trimmedNickname
    ) {
      showAlert("모든 항목을 입력해주세요.", "error");
      return;
    }

    // 비밀번호와 비밀번호 확인 값이 같은지 프론트에서 확인
    // confirmPassword는 백엔드 API에는 전송하지 않는다.
    if (password !== confirmPassword) {
      showAlert("비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    // API 요청이 진행되는 동안 공통 로딩 화면을 표시
    startLoading();

    try {
      // 백엔드 회원가입 API에 아이디, 비밀번호, 닉네임 전달
      const response = await axios.post("/users/signup", {
        loginId: trimmedLoginId,
        password,
        nickname: trimmedNickname,
      });

      // 백엔드에서 전달한 성공 메시지를 공통 알림으로 표시
      showAlert(
        response.data?.message ?? "회원가입에 성공했습니다.",
      );

      // 회원가입 성공 후 로그인할 수 있도록 로그인 페이지로 이동
      navigate("/signin");
    } catch (error) {
      // 백엔드의 에러 메시지가 있으면 우선 사용하고,
      // 없으면 기본 회원가입 실패 메시지를 표시한다.
      const errorMessage =
        error.response?.data?.message
        ?? error.message
        ?? "회원가입에 실패했습니다.";

      showAlert(errorMessage, "error");
    } finally {
      // 성공 또는 실패와 관계없이 API 요청이 끝나면 로딩 종료함
      endLoading();
    }
  };

  return (
    <>
      <section className="auth_section">
        <Link to="/" className="logo">
          <img src={logoImage} alt="공부의 숲 로고 이미지" />
        </Link>
        <div className="inner">
          <div className="card_container auth_container">
            <form className="inner" onSubmit={handleSignup}>
              <div className="auth_input_wrap">
                <label htmlFor="loginId">아이디</label>
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  minLength="4"
                  maxLength="20"
                  pattern="[a-z0-9]{4,20}"
                  title="아이디는 영문 소문자와 숫자로 4~20자 입력해주세요."
                  placeholder="아이디를 입력해주세요."
                  value={loginId}
                  onChange={(event) => setLoginId(event.target.value)}
                  required
                />
              </div>
              <div className="auth_input_wrap">
                <label htmlFor="password">비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength="8"
                  maxLength="20"
                  pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,20}"
                  title="비밀번호는 영문과 숫자를 포함해 8~20자 입력해주세요."
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {/* 입력한 비밀번호를 한 번 더 확인하는 입력창 */}
              <div className="auth_input_wrap">
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  minLength="8"
                  maxLength="20"
                  pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,20}"
                  title="비밀번호는 영문과 숫자를 포함해 8~20자 입력해주세요."
                  placeholder="비밀번호를 다시 입력해주세요."
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              {/* 화면에 표시할 사용자 닉네임 입력창 */}
              <div className="auth_input_wrap">
                <label htmlFor="nickname">닉네임</label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  minLength="2"
                  maxLength="10"
                  pattern="[가-힣A-Za-z0-9]{2,10}"
                  title="닉네임은 한글, 영문, 숫자로 2~10자 입력해주세요."
                  placeholder="닉네임을 입력해주세요."
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="252"
                  height="54"
                  viewBox="0 0 252 54"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M25.6491 0.0324321C27.1731 0.0684321 230.297 0.00243214 232.523 0.0324321C237.269 0.110432 248.513 -0.00356827 250.745 8.79843C253.349 19.0764 251.243 40.9404 250.247 44.5764C249.257 48.2124 247.523 53.9964 238.517 53.9964H16.0851C14.5971 53.9964 3.19715 53.4204 1.21115 42.5124C-0.768853 31.6104 0.221147 16.5744 0.449147 13.3104C0.677147 10.0524 1.29515 1.04043 12.3651 0.374432C19.2411 -0.0335681 22.8951 -0.0335679 25.6491 0.0324321Z"
                    fill="#578246"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="252"
                  height="54"
                  viewBox="0 0 252 54"
                  preserveAspectRatio="none"
                  fill="none"
                  className="shadow"
                >
                  <path
                    d="M25.6491 0.0296702C27.1731 0.0656702 230.297 -0.000329804 232.523 0.0296702C237.269 0.10767 248.513 -0.00632973 250.745 8.79567C253.349 19.0737 251.243 40.9377 250.247 44.5737C249.257 48.2097 247.523 53.9937 238.517 53.9937H16.0851C14.5971 53.9937 3.19715 53.4177 1.21115 42.5097C-0.768853 31.6077 0.221147 16.5717 0.449147 13.3077C0.677147 10.0497 1.29515 1.03767 12.3651 0.37767C19.2471 -0.0363298 22.9011 -0.0303298 25.6491 0.0296702Z"
                    fill="#99C08E"
                  />
                </svg>
                <span className="shadow">회원가입</span>
                <span>회원가입</span>
              </button>
              <Link to="/signin" className="btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="252"
                  height="54"
                  viewBox="0 0 252 54"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M25.6491 0.0324321C27.1731 0.0684321 230.297 0.00243214 232.523 0.0324321C237.269 0.110432 248.513 -0.00356827 250.745 8.79843C253.349 19.0764 251.243 40.9404 250.247 44.5764C249.257 48.2124 247.523 53.9964 238.517 53.9964H16.0851C14.5971 53.9964 3.19715 53.4204 1.21115 42.5124C-0.768853 31.6104 0.221147 16.5744 0.449147 13.3104C0.677147 10.0524 1.29515 1.04043 12.3651 0.374432C19.2411 -0.0335681 22.8951 -0.0335679 25.6491 0.0324321Z"
                    fill="#578246"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="252"
                  height="54"
                  viewBox="0 0 252 54"
                  preserveAspectRatio="none"
                  fill="none"
                  className="shadow"
                >
                  <path
                    d="M25.6491 0.0296702C27.1731 0.0656702 230.297 -0.000329804 232.523 0.0296702C237.269 0.10767 248.513 -0.00632973 250.745 8.79567C253.349 19.0737 251.243 40.9377 250.247 44.5737C249.257 48.2097 247.523 53.9937 238.517 53.9937H16.0851C14.5971 53.9937 3.19715 53.4177 1.21115 42.5097C-0.768853 31.6077 0.221147 16.5717 0.449147 13.3077C0.677147 10.0497 1.29515 1.03767 12.3651 0.37767C19.2471 -0.0363298 22.9011 -0.0303298 25.6491 0.0296702Z"
                    fill="#99C08E"
                  />
                </svg>
                <span className="shadow">로그인</span>
                <span>로그인</span>
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUpPage;
