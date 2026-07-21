import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../assets/img/logo.png";
import userIcon from "../assets/img/ic_user.svg";
import Button from "./Button.jsx";
import UserMenu from "./user/UserMenu";

function Header() {
  const { pathname } = useLocation();
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleIsUserMenuOpen = () => {
    setIsUserMenuOpen((isOpen) => !isOpen);
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
              {/* <Button
                as={Link}
                to="/study-create"
                className="create_study_btn"
              >
                스터디 만들기
              </Button> */}

              <div className="user_wrap">
                <button
                  className="user_pic_wrap"
                  type="button"
                  aria-label="사용자 메뉴 열기"
                  aria-expanded={isUserMenuOpen}
                  onClick={toggleIsUserMenuOpen}
                >
                  <img src={userIcon} alt="" />
                </button>
                {isUserMenuOpen && (
                  <UserMenu toggleIsUserMenuOpen={toggleIsUserMenuOpen} />
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
