import { Link, useNavigate } from "react-router-dom";
import { removeUserId } from "../../utils/authStorage.js";

function UserMenu({ toggleIsUserMenuOpen }) {
  // 로그아웃 후 로그인 페이지로 이동할 때 사용하는 함수
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage에 저장된 로그인 사용자 ID 삭제
    removeUserId();

    // 열려 있는 사용자 메뉴 닫기
    toggleIsUserMenuOpen();

    // 로그아웃 후 로그인 페이지로 이동
    // replace를 사용하면 뒤로 가기로 로그아웃 전 페이지로 돌아가는 것을 줄일 수 있음
    navigate("/signin", { replace: true });
  };

  return (
    // 메뉴 바깥쪽 영역을 클릭하면 사용자 메뉴 닫기
    <div className="user_menu_wrap" onClick={toggleIsUserMenuOpen}>
      <div
        className="user_menu_container"
        // 메뉴 내부 클릭이 바깥 영역까지 전달되지 않도록 막음
        onClick={(event) => event.stopPropagation()}
      >
        <Link to="/user/dashboard" className="user_menu">
          대시보드
        </Link>

        <Link to="/study-create" className="user_menu">
          스터디 등록
        </Link>

        <button
          type="button"
          className="user_menu red"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default UserMenu;