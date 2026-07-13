import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import AlertMessage from "../components/AlertMessage.jsx";
import "./StudyCreatePage.css";
import "../style.css";

const API_BASE_URL = "http://127.0.0.1:3000";

const getStudyErrorMessage = async (response) => {
  try {
    const result = await response.json();

    return result?.error?.message || result?.message || "스터디 정보를 불러오지 못했습니다.";
  } catch {
    return "스터디 정보를 불러오지 못했습니다.";
  }
};

const StudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      const response = await fetch(`${API_BASE_URL}/study/${id}${isDeleteAction ? "" : "/password/verify"}`, {
        method: isDeleteAction ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(await getStudyErrorMessage(response));
      }

      setPassword("");
      setPasswordError("");
      setIsPasswordModalOpen(false);
      setPasswordAction("navigate");
      navigate(isDeleteAction ? "/" : nextPath);
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

  return (
    <main>
      <header>
        <div className="emoji-container" ref={emojiRef}>
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
      </header>

      <section className="study-detail-section">
        <h1>
          {study.nickname}의 {study.name}
        </h1>

        <div>
          <span>소개</span>
          <p>{study.description}</p>
        </div>

        <div>
          <span>현재까지 획득한 포인트</span>
          <p> {study.point}P 획득</p>
        </div>
        <div className="study-menu-buttons">
          <button
            type="button"
            onClick={() => handleOpenPasswordModal(`/study/${id}/edit`)}
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={() => handleOpenPasswordModal("", "delete")}
          >
            삭제하기
          </button>
        </div>
        <div className="study-action-buttons">
          <button
            type="button"
            onClick={() => navigate(`/study/${id}/habit`)}
          >
            오늘의 습관
          </button>

          <button
            type="button"
            onClick={() => navigate(`/study/${id}/focus`)}
          >
            오늘의 집중
          </button>
        </div>
      </section>
      <section>습관 영역</section>

      {isPasswordModalOpen && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h2>
              {study.nickname}의 {study.name}
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
              <button
                type="button"
                onClick={closePasswordModal}
              >
                나가기
              </button>

              <button type="button" onClick={handlePasswordCheck}>
                {passwordAction === "delete" ? "삭제하기" : "수정하러 가기"}
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
    </main>
  );
};

export default StudyDetailPage;
