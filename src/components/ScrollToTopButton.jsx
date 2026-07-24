import { useEffect, useState } from "react";
import arrowIcon from "../assets/img/ic_arrow_right.svg";

const SCROLL_THRESHOLD = 300;

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scroll-to-top-button ${isVisible ? "is-visible" : ""}`}
      type="button"
      aria-label="페이지 최상단으로 이동"
      onClick={scrollToTop}
      tabIndex={isVisible ? 0 : -1}
    >
      <img src={arrowIcon} alt="" />
    </button>
  );
}

export default ScrollToTopButton;
