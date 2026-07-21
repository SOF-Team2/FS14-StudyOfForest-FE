import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/img/logo.png";
import userIcon from "../assets/img/ic_user_line.svg";
import UserMenu from "./user/UserMenu";
import { getUserId, removeUserId } from "../utils/authStorage.js";

const USER_MENU_ANIMATION_MS = 250;

const getIsAuthenticated = () =>
  Boolean(getUserId());

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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
    removeUserId();
    setIsAuthenticated(false);
    closeUserMenu();
    navigate("/signin", { replace: true });
  };

  return (
    <>
      {!isAuthPage && (
        <header id="header">
          <div className="inner">
            <Link to="/" className="logo">
              <img src={logoImage} alt="공부의 숲 로고 이미지" />
            </Link>

            <div className="header-actions">
              <div
                className={`user_wrap ${isUserMenuOpen ? "has-menu" : ""} ${
                  isUserMenuVisible && !isUserMenuOpen ? "is-closing" : ""
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
