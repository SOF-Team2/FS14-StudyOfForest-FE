import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/img/logo.png";
import userIcon from "../assets/img/ic_user_line.svg";
import rankingIcon from "../assets/img/ic_trophy.svg";
import UserMenu from "./user/UserMenu";
import { getUserId, removeUserId } from "../utils/authStorage.js";
import useAlert from "./useAlert.js";

const USER_MENU_ANIMATION_MS = 250;

const getIsAuthenticated = () =>
  Boolean(getUserId());

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(getIsAuthenticated);
  const userMenuCloseTimerRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(userMenuCloseTimerRef.current);
  }, []);

  useEffect(() => {
    setIsAuthenticated(getIsAuthenticated());
  }, [pathname]);

  const openUserMenu = () => {
    window.clearTimeout(userMenuCloseTimerRef.current);
    setIsUserMenuVisible(true);
    setIsUserMenuOpen(true);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
    window.clearTimeout(userMenuCloseTimerRef.current);
    userMenuCloseTimerRef.current = window.setTimeout(() => {
      setIsUserMenuVisible(false);
    }, USER_MENU_ANIMATION_MS);
  };

  const toggleIsUserMenuOpen = () => {
    if (isUserMenuOpen) {
      closeUserMenu();
      return;
    }

    openUserMenu();
  };

  const logout = () => {
    // 브라우저에 저장된 로그인 사용자 ID를 삭제한다.
    removeUserId();

    // Header의 로그인 상태를 즉시 로그아웃 상태로 변경한다.
    setIsAuthenticated(false);

    // 열려 있는 사용자 메뉴를 닫는다.
    closeUserMenu();

    // 공통 Alert를 통해 로그아웃 완료 메시지를 표시한다.
    showAlert("로그아웃되었습니다.");

    // 로그인 페이지로 이동하며, 뒤로 가기 기록을 남기지 않는다.
    navigate("/signin", { replace: true });
  };

  return (
    <>
      {!isAuthPage && (
        <header id="header">
          <div className="inner">
            <Link to={isAuthenticated ? "/home" : "/"} className="logo">
              <img src={logoImage} alt="공부의 숲 로고 이미지" />
            </Link>

            <div className="header-actions">
              <Link to="/ranking" className="ranking_icon">
                <img src={rankingIcon} alt="" />
              </Link>
              <div
                className={`user_wrap ${isUserMenuOpen ? "has-menu" : ""} ${isUserMenuVisible && !isUserMenuOpen ? "is-closing" : ""
                  }`}
              >
                <button
                  className="user_pic_wrap"
                  type="button"
                  aria-label="사용자 메뉴 열기"
                  aria-expanded={isUserMenuOpen}
                  onClick={toggleIsUserMenuOpen}
                >
                  <img src={userIcon} alt="" />
                </button>
                {isUserMenuVisible && (
                  <UserMenu
                    isOpen={isUserMenuOpen}
                    isAuthenticated={isAuthenticated}
                    onClose={closeUserMenu}
                    onLogout={logout}
                  />
                )}
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
}

export default Header;
