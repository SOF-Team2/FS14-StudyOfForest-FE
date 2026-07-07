import logoImage from '../assets/img/logo.png';

function Header() {
  return (
    <>
      <header id="header">
        <div className="inner">
          <a href="#" className="logo">
            <img src={logoImage} alt="공부의 숲 로고 이미지" />
          </a>
          <div className="create_study_btn">
            스터디 만들기
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;