import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAlert from "../components/useAlert.js";
import { useLoading } from "../contexts/LoadingContext.jsx";
import axios from "../utils/axios.js";
import { saveUserId } from "../utils/authStorage.js";
import logoImage from "../assets/img/logo.png";

function SignInPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { startLoading, endLoading } = useLoading();

  const handleLogin = async (event) => {
    event.preventDefault();

    const trimmedLoginId = loginId.trim();

    if (!trimmedLoginId || !password) {
      showAlert("아이디와 비밀번호를 모두 입력해주세요.", "error");
      return;
    }

    startLoading();

    try {
      const response = await axios.post("/users/login", {
        loginId: trimmedLoginId,
        password,
      });

      const userId = response.data?.data?.id;

      if (!userId) {
        throw new Error(
          "로그인 응답에서 사용자 ID를 확인할 수 없습니다.",
        );
      }

      saveUserId(userId);

      showAlert(
        response.data?.message ?? "로그인에 성공했습니다.",
      );

      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ??
        error.message ??
        "로그인에 실패했습니다.";

      showAlert(errorMessage, "error");
    } finally {
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
            <form className="inner" onSubmit={handleLogin}>
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
                <span className="shadow">로그인</span>
                <span>로그인</span>
              </button>
              <Link to="/signup" className="btn">
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
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignInPage;
