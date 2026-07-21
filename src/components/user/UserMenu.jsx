import { Link } from "react-router-dom";

function DashboardIcon() {
  return (
    <svg className="user_menu_icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function StudyRegisterIcon() {
  return (
    <svg className="user_menu_icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3H14L18 7V21H6V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3V7H18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 11V17M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="user_menu_icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 4H5V20H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 8L17 12L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SignUpIcon() {
  return (
    <svg className="user_menu_icon user_menu_signup_icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20C3 16.686 5.686 14 9 14C10.246 14 11.402 14.38 12.36 15.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 8V14M15 11H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserMenu({ isOpen, isAuthenticated, onClose, onLogout }) {
  return (
    <>
      <button
        className="user_menu_wrap"
        type="button"
        aria-label="사용자 메뉴 닫기"
        onClick={onClose}
      />
      <nav
        className={`user_menu_container ${isAuthenticated ? "" : "is-guest"} ${
          isOpen ? "is-open" : "is-closing"
        }`}
        aria-label="사용자 메뉴"
      >
        {isAuthenticated ? (
          <>
            <div className="user_menu user_menu_header user_menu_with_icon">
              <span className="user_menu_label">내 정보</span>
            </div>
            <Link to="/user/dashboard" className="user_menu user_menu_with_icon">
              <DashboardIcon />
              <span className="user_menu_label">대시보드</span>
            </Link>
            <Link to="/study-create" className="user_menu user_menu_with_icon">
              <StudyRegisterIcon />
              <span className="user_menu_label">스터디 등록</span>
            </Link>
            <button className="user_menu user_menu_with_icon red" type="button" onClick={onLogout}>
              <LogoutIcon />
              <span className="user_menu_label">로그아웃</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="user_menu user_menu_with_icon">
              <span className="user_menu_label">로그인</span>
            </Link>
            <Link to="/signup" className="user_menu user_menu_with_icon">
              <span className="user_menu_label">회원가입</span>
              <SignUpIcon />
            </Link>
          </>
        )}
      </nav>
    </>
  );
}

export default UserMenu;
