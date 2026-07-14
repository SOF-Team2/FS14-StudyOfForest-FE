import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import AlertMessage from "../components/AlertMessage.jsx";
import tagImg from "../assets/img/ic_point.svg";
import "./StudyCreatePage.css";
import "../style.css";
import WeeklyHabitRecordTable from "../components/habit/WeeklyHabitRecordTable.jsx";
import arrowRightIcon from "../assets/img/ic_arrow_right.svg";
import useAlert from "../components/useAlert.js";

//const API_BASE_URL = "http://127.0.0.1:3000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getStudyErrorMessage = async (response) => {
  try {
    const result = await response.json();

    return (
      result?.error?.message ||
      result?.message ||
      "스터디 정보를 불러오지 못했습니다."
    );
  } catch {
    return "스터디 정보를 불러오지 못했습니다.";
  }
};

const StudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [study, setStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("");
  const [passwordAction, setPasswordAction] = useState("navigate");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isEmojiMoreOpen, setIsEmojiMoreOpen] = useState(false);
  const emojiRef = useRef(null);
  const [emoji, setEmoji] = useState([]);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setIsEmojiOpen(false);
        setIsEmojiMoreOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsEmojiOpen(false);
        setIsEmojiMoreOpen(false);
        setIsPasswordModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudy = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/study/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await getStudyErrorMessage(response));
        }

        const result = await response.json();
        const nextStudy = result?.data;

        if (!nextStudy?.id) {
          throw new Error("스터디 정보를 불러오지 못했습니다.");
        }

        setStudy(nextStudy);
        setEmoji(Array.isArray(nextStudy.emojis) ? nextStudy.emojis : []);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setStudy(null);
        setEmoji([]);
        setErrorMessage(error.message || "스터디 정보를 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchStudy();

    return () => controller.abort();
  }, [id]);

  // 이모지 선택시 출력 확인
  const handleEmojiClick = async (selectedEmoji) => {
    try {
      const response = await fetch(`${API_BASE_URL}/study/${id}/emojis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emoji: selectedEmoji }),
      });

      if (!response.ok) {
        throw new Error(await getStudyErrorMessage(response));
      }

      const result = await response.json();
      const updatedEmoji = result?.data;

      if (!updatedEmoji?.emoji) {
        throw new Error("응원 이모지를 저장하지 못했습니다.");
      }

      setEmoji((prevEmoji) => {
        const alreadyExists = prevEmoji.some(
          (item) => item.emoji === updatedEmoji.emoji,
        );

        if (alreadyExists) {
          return prevEmoji.map((item) =>
            item.emoji === updatedEmoji.emoji
              ? { ...item, ...updatedEmoji }
              : item,
          );
        }

        return [...prevEmoji, updatedEmoji];
      });
      setIsEmojiOpen(false);
      setIsEmojiMoreOpen(false);
    } catch (error) {
      setPasswordError(error.message || "응원 이모지를 저장하지 못했습니다.");
    }
  };

  // 이모지 3개까지만 보여주고 나머지는 +N으로 표시
  const visibleEmoji = emoji.slice(0, 3);
  const hiddenEmoji = emoji.slice(3);

  //모달
  const handleOpenPasswordModal = (path, action = "navigate") => {
    setNextPath(path);
    setPasswordAction(action);
    setPassword("");
    setPasswordError("");
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPassword("");
    setPasswordError("");
    setPasswordAction("navigate");
    setNextPath("");
  };

  const handlePasswordCheck = async () => {
    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const isDeleteAction = passwordAction === "delete";
      const response = await fetch(
        `${API_BASE_URL}/study/${id}${isDeleteAction ? "" : "/password/verify"}`,
        {
          method: isDeleteAction ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        },
      );

      if (!response.ok) {
        throw new Error(await getStudyErrorMessage(response));
      }

      setPassword("");
      setPasswordError("");
      setIsPasswordModalOpen(false);
      setPasswordAction("navigate");
      navigate(isDeleteAction ? "/" : nextPath, {
        state: {
          password,
        },
      });
    } catch (error) {
      setPasswordError(error.message || "비밀번호가 일치하지 않습니다.");
    }
  };

  if (isLoading) {
    return (
      <main>
        <AlertMessage message="스터디 정보를 불러오는 중입니다." />
      </main>
    );
  }

  if (errorMessage || !study) {
    return (
      <main>
        <AlertMessage
          message={errorMessage || "스터디를 찾을 수 없습니다."}
          variant="error"
          onClose={() => setErrorMessage("")}
        />
      </main>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showAlert("주소복사완료");
    } catch (error) {
      console.log(error);
      showAlert("주소복사실패");
    }
  };

  return (
    <section>
      <div className="inner">
        <section className="study-detail-section card_container">
          <div className="emoji_line">
            <div
              className="emoji-container"
              ref={emojiRef}
              style={{ marginBottom: "24px" }}
            >
              {/* 화면에 기본으로 보여줄 이모지 3개 */}
              {visibleEmoji.map((item) => (
                <button
                  type="button"
                  key={item.emoji}
                  className="emoji-item"
                  onClick={() => handleEmojiClick(item.emoji)}
                >
                  <span>{item.emoji}</span>
                  <span>{item.count}</span>
                </button>
              ))}

              {/* 숨겨진 이모지 목록 */}
              {hiddenEmoji.length > 0 && (
                <div className="emoji-more-wrapper">
                  <button
                    type="button"
                    className="emoji-more-button"
                    onClick={() => {
                      setIsEmojiMoreOpen((prev) => !prev);
                      setIsEmojiOpen(false);
                    }}
                  >
                    +{hiddenEmoji.length}...
                  </button>

                  {isEmojiMoreOpen && (
                    <div className="more-emoji-list">
                      {hiddenEmoji.map((item) => (
                        <button
                          type="button"
                          key={item.emoji}
                          className="emoji-item"
                          onClick={() => {
                            handleEmojiClick(item.emoji);
                            setIsEmojiOpen(false);
                            setIsEmojiMoreOpen(false);
                          }}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 이모지 추가 */}
              <div className="emoji-add-wrapper">
                <button
                  type="button"
                  className="emoji-add-button"
                  onClick={() => {
                    setIsEmojiOpen((prev) => !prev);
                    setIsEmojiMoreOpen(true);
                  }}
                >
                  <span></span>
                  <span>추가</span>
                </button>

                {isEmojiOpen && (
                  <div className="emoji-picker">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        handleEmojiClick(emojiData.emoji);
                        // setIsEmojiOpen(false);
                        // setIsEmojiMoreOpen(true);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="study-menu-buttons">
              <button type="button" onClick={handleShare}>
                공유하기
              </button>
              <span className="dec_line">|</span>

              <button
                type="button"
                onClick={() => handleOpenPasswordModal(`/study/${id}/edit`)}
              >
                수정하기
              </button>
              <span className="dec_line">|</span>
              <button
                className="delete"
                type="button"
                onClick={() => handleOpenPasswordModal("", "delete")}
              >
                삭제하기
              </button>
            </div>
          </div>
          <div className="container_title">
            {study.nickname} 의 {study.name}
            <nav
              className="focus-page__navigation"
              aria-label="스터디 페이지 이동"
            >
              <button
                type="button"
                className="focus-page__navigation-button"
                onClick={() => handleOpenPasswordModal(`/study/${id}/habit`)}
              >
                <span>오늘의 습관</span>

                <img
                  className="focus-page__navigation-icon"
                  src={arrowRightIcon}
                  alt=""
                />
              </button>

              <button
                type="button"
                className="focus-page__navigation-button"
                onClick={() => handleOpenPasswordModal(`/study/${id}/focus`)}
              >
                <span>오늘의 집중</span>

                <img
                  className="focus-page__navigation-icon"
                  src={arrowRightIcon}
                  alt=""
                />
              </button>
            </nav>
          </div>

          <div>
            <span
              style={{ fontSize: "18px", color: "#818181", fontWieht: "300" }}
            >
              소개
            </span>
            <p
              style={{
                display: "block",
                margin: "8px 0 24px",
                fontSize: "18px",
              }}
            >
              {study.description}
            </p>
          </div>

          <div>
            <span
              style={{
                display: "block",
                fontSize: "18px",
                color: "#818181",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              현재까지 획득한 포인트
            </span>
            <div className="tag point_tag" style={{ marginBottom: "40px" }}>
              <img src={tagImg} alt="태그 장식" />
              {study.point}P 획득
            </div>
          </div>
          <WeeklyHabitRecordTable studyId={id} />
        </section>

        {isPasswordModalOpen && (
          <div className="password-modal-overlay" onClick={closePasswordModal}>
            <div
              className="password-modal"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <h2>
                {study.nickname} 의 {study.name}
              </h2>
              <p>권한이 필요해요</p>
              <span>비밀번호</span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호를 입력하세요"
              />

              <div>
                <button type="button" onClick={handlePasswordCheck}>
                  {passwordAction === "delete" ? "삭제하기" : "확인"}
                </button>
              </div>
            </div>
            <AlertMessage
              message={passwordError}
              variant="error"
              onClose={() => setPasswordError("")}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyDetailPage;
