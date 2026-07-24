import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import AlertMessage from "../components/AlertMessage.jsx";
import PointSummary from "../components/PointSummary.jsx";
import "../style.css";
import WeeklyHabitRecordTable from "../components/habit/WeeklyHabitRecordTable.jsx";
import arrowRightIcon from "../assets/img/ic_arrow_right.svg";
import plusIcon from "../assets/img/ic_plus.svg";
import useAlert from "../components/useAlert.js";
import { getStudyBackgroundStyle } from "../utils/studyBackground.js";
import axios from "../utils/axios.js";
import { getUserId } from "../utils/authStorage.js";
import FavoriteButton from "../components/favoriteButton.jsx";
import StudyDeleteModal from "../components/study/StudyDeleteModal.jsx";

const getStudyErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.error?.message ||
  error?.response?.data?.message ||
  error?.message ||
  fallbackMessage;

const StudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const currentUserId = getUserId();
  const [study, setStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isEmojiMoreOpen, setIsEmojiMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const emojiRef = useRef(null);
  const [emoji, setEmoji] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
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
    const fetchMemberData = async () => {
      try {
        const countRes = await axios.get(`/study/${id}/members/count`);
        setMemberCount(countRes.data ?? 0);

        const membersRes = await axios.get(`/study/${id}/members`);
        setMembers(membersRes.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMemberData();
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudy = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get(`/study/${id}`, {
          signal: controller.signal,
        });

        const nextStudy = response.data?.data ?? response.data;

        if (!nextStudy?.id) {
          throw new Error("스터디 정보를 불러오지 못했습니다.");
        }

        setStudy(nextStudy);
        setEmoji(Array.isArray(nextStudy.emojis) ? nextStudy.emojis : []);
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.name === "AbortError" ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }
        setStudy(null);
        setEmoji([]);
        setErrorMessage(
          getStudyErrorMessage(error, "스터디 정보를 불러오지 못했습니다."),
        );
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
      const response = await axios.post(`/study/${id}/emojis`, {
        emoji: selectedEmoji,
      });

      const updatedEmoji = response.data?.data ?? response.data;

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
      showAlert(
        getStudyErrorMessage(error, "응원 이모지를 저장하지 못했습니다."),
      );
    }
  };

  // 이모지 3개까지만 보여주고 나머지는 +N으로 표시
  const visibleEmoji = emoji.slice(0, 3);
  const hiddenEmoji = emoji.slice(3);

  const handleOwnerNavigation = (path) => {
    if (!study?.isOwner) {
      showAlert("스터디 생성자만 이용할 수 있습니다.", "error");
      return;
    }

    navigate(path);
  };

  const handleOpenDeleteModal = () => {
    if (!study?.isOwner) {
      showAlert("스터디 생성자만 삭제할 수 있습니다.", "error");
      return;
    }

    setDeleteConfirmation("");
    setDeleteErrorMessage("");
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeleteConfirmation("");
    setDeleteErrorMessage("");
  };

  const handleDeleteStudy = async () => {
    if (deleteConfirmation !== study?.name || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteErrorMessage("");

    try {
      await axios.delete(`/study/${id}`);
      navigate("/");
    } catch (error) {
      setDeleteErrorMessage(
        getStudyErrorMessage(error, "스터디를 삭제하지 못했습니다."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFavoriteChange = (studyId, nextIsFavorite) => {
    setStudy((prevStudy) => {
      if (!prevStudy || prevStudy.id !== studyId) {
        return prevStudy;
      }

      return {
        ...prevStudy,
        isFavorite: nextIsFavorite,
      };
    });
  };

  const handleJoin = async () => {
    try {
      await axios.post(`/study/${id}/members`);
      showAlert("스터디에 참여했습니다.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showAlert(getStudyErrorMessage(error, "참여에 실패했습니다."));
    }
  };

  const handleLeaveStudy = async () => {
    try {
      await axios.delete(`/study/${id}/members`);
      showAlert("스터디에서 나갔습니다.");
      navigate("/");
    } catch (error) {
      showAlert(getStudyErrorMessage(error, "나가기에 실패했습니다."));
    }
  };

  const handleToggleRecruiting = async () => {
    try {
      await axios.patch(`/study/${id}/recruiting`, {
        isRecruiting: !study.isRecruiting,
      });
      showAlert(
        study.isRecruiting ? "모집을 마감했습니다." : "모집을 재개했습니다.",
      );
      window.location.reload();
    } catch (error) {
      showAlert(getStudyErrorMessage(error, "처리에 실패했습니다."));
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
  const studyDetailBackgroundStyle = getStudyBackgroundStyle(study);

  return (
    <section>
      <div className="inner">
        <section className="study-detail-section card_container">
          <div
            className="study-detail-background-layer"
            style={studyDetailBackgroundStyle}
            aria-hidden="true"
          />

          <div className="study-detail-content">
            {study.isOwner && (
              <nav
                className="focus-page__navigation"
                aria-label="스터디 페이지 이동"
              >
                <button
                  type="button"
                  className="focus-page__navigation-button"
                  onClick={() => handleOwnerNavigation(`/study/${id}/habit`)}
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
                  onClick={() => handleOwnerNavigation(`/study/${id}/focus`)}
                >
                  <span>오늘의 집중</span>

                  <img
                    className="focus-page__navigation-icon"
                    src={arrowRightIcon}
                    alt=""
                  />
                </button>
              </nav>
            )}

            <div className="study-detail-secondary-actions">
              <div className="study-detail-point-summary">
                <PointSummary point={study.point} variant="detail" />
              </div>

              <div className="study-menu-buttons">
                {study.isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOwnerNavigation(`/study/${id}/edit`)}
                    >
                      수정하기
                    </button>
                    <span className="dec_line">|</span>

                    <button
                      className="delete"
                      type="button"
                      onClick={handleOpenDeleteModal}
                    >
                      삭제하기
                    </button>
                    <span className="dec_line">|</span>

                    <button type="button" onClick={handleToggleRecruiting}>
                      {study.isRecruiting ? "모집 마감" : "모집 재개"}
                    </button>
                    <span className="dec_line">|</span>
                  </>
                ) : (
                  <>
                    {!study.isMember && (
                      <>
                        <button type="button" onClick={handleJoin}>
                          참여하기
                        </button>
                        <span className="dec_line">|</span>
                      </>
                    )}
                  </>
                )}
                <button type="button" onClick={handleShare}>
                  공유하기
                </button>
              </div>
            </div>

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
                <div
                  className={`emoji-add-wrapper${isEmojiOpen ? " is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="emoji-add-button"
                    aria-label="이모지 추가"
                    onClick={() => {
                      setIsEmojiOpen((prev) => !prev);
                      setIsEmojiMoreOpen(false);
                    }}
                  >
                    <img
                      className="emoji-add-icon"
                      src={plusIcon}
                      alt=""
                      aria-hidden="true"
                    />
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
            </div>

            <div className="container_title">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div className="study-detail-title">
                  <span>{study.nickname}</span>
                  <span>의</span>
                  <span>{study.name}</span>
                </div>

                <div>
                  <button
                    type="button"
                    className="focus-page__navigation-button"
                    onClick={() => setIsMemberModalOpen(true)}
                  >
                    <span>멤버 목록</span>
                    <span style={{ marginLeft: "8px" }}>{memberCount}/3</span>
                  </button>
                </div>
              </div>

              <div>
                {isMemberModalOpen && (
                  <div
                    tabIndex={-1}
                    onClick={() => setIsMemberModalOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsMemberModalOpen(false);
                    }}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: "white",
                        padding: "24px",
                        width: "340px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h3 style={{ margin: 0 }}>참여자 목록</h3>
                        {!study.isOwner &&
                          members.some(
                            (member) => member.userId === currentUserId,
                          ) && (
                            <button
                              type="button"
                              onClick={handleLeaveStudy}
                              style={{
                                color: "red",
                                background: "none",
                                border: "1px solid red",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                padding: "6px 14px",
                              }}
                            >
                              나가기
                            </button>
                          )}
                      </div>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {[...members]
                          .sort((a, b) =>
                            a.role === "HOST" ? -1 : b.role === "HOST" ? 1 : 0,
                          )
                          .map((member) => (
                            <li
                              key={member.id}
                              style={{ padding: "6px 0", fontSize: "14px" }}
                            >
                              {member.role === "HOST" ? "👑 " : ""}
                              {member.user.nickname}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <FavoriteButton
                studyId={study.id}
                isFavorite={study.isFavorite ?? false}
                onFavoriteChange={handleFavoriteChange}
              />
            </div>

            <div>
              <span
                style={{
                  fontSize: "22px",
                  color: "#000000",
                  fontWeight: "300",
                }}
              >
                소개
              </span>
              <p
                style={{
                  display: "block",
                  margin: "8px 0 24px",
                  fontSize: "18px",
                  color: "#000000",
                }}
              >
                {study.description}
              </p>
            </div>
          </div>

          <WeeklyHabitRecordTable studyId={id} />
        </section>

        {isDeleteModalOpen && (
          <StudyDeleteModal
            studyName={study.name}
            confirmation={deleteConfirmation}
            errorMessage={deleteErrorMessage}
            isDeleting={isDeleting}
            onConfirmationChange={(value) => {
              setDeleteConfirmation(value);
              setDeleteErrorMessage("");
            }}
            onCancel={handleCloseDeleteModal}
            onConfirm={handleDeleteStudy}
          />
        )}
      </div>
    </section>
  );
};

export default StudyDetailPage;
