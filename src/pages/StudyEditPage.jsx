import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../components/AlertMessage.jsx";
import useAlert from "../components/useAlert.js";
import selectedIcon from "../assets/img/ic_bg_selected.png";
import "./StudyCreatePage.css";

//const API_BASE_URL = "http://127.0.0.1:3000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const backgroundOptions = [
  { id: "green", type: "color", value: "#E1EDDE", className: "study-create-bg-green" },
  { id: "yellow", type: "color", value: "#FFF1CC", className: "study-create-bg-yellow" },
  { id: "blue", type: "color", value: "#E0F1F5", className: "study-create-bg-blue" },
  { id: "pink", type: "color", value: "#FDE0E9", className: "study-create-bg-pink" },
  { id: "desk", type: "image", value: "desk", className: "study-create-bg-desk" },
  { id: "window", type: "image", value: "window", className: "study-create-bg-window" },
  { id: "tiles", type: "image", value: "tiles", className: "study-create-bg-tiles" },
  { id: "leaves", type: "image", value: "leaves", className: "study-create-bg-leaves" },
];

const initialFormValues = {
  nickname: "",
  studyName: "",
  description: "",
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

const initialErrors = {
  nickname: "",
  studyName: "",
  description: "",
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

const getResponseErrorMessage = async (response) => {
  try {
    const result = await response.json();

    return result?.error?.message || result?.message || "스터디 수정에 실패했습니다.";
  } catch {
    return "스터디 수정에 실패했습니다.";
  }
};

const normalizeSubmitErrorMessage = (error) => {
  if (error.message === "Failed to fetch") {
    return "서버에 연결할 수 없습니다. 백엔드 서버를 확인해주세요.";
  }

  return error.message || "스터디 수정에 실패했습니다.";
};

const getSelectedBackgroundId = (study) => {
  const backgroundType = study?.backgroundType ?? "";
  const backgroundValue = study?.backgroundValue ?? "";
  const normalizedBackgroundValue = backgroundValue.toLowerCase();

  const matchedOption = backgroundOptions.find((option) => (
    (option.type === backgroundType && option.value === backgroundValue)
    || option.id === normalizedBackgroundValue
    || option.value.toLowerCase() === normalizedBackgroundValue
  ));

  return matchedOption?.id ?? backgroundOptions[0].id;
};

function StudyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0].id);
  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    newPasswordConfirm: false,
  });
  const [changePassword, setChangePassword] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [pageErrorMessage, setPageErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudy = async () => {
      setIsLoading(true);
      setPageErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/study/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await getResponseErrorMessage(response));
        }

        const result = await response.json();
        const study = result?.data;

        if (!study) {
          throw new Error("스터디 정보를 불러오지 못했습니다.");
        }

        setFormValues({
          nickname: study.nickname ?? "",
          studyName: study.name ?? "",
          description: study.description ?? "",
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        });
        setSelectedBackground(getSelectedBackgroundId(study));
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setPageErrorMessage(normalizeSubmitErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchStudy();

    return () => controller.abort();
  }, [id]);

  const clearErrors = (...fieldNames) => {
    setSubmitErrorMessage("");

    setErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };

      fieldNames.forEach((fieldName) => {
        nextErrors[fieldName] = "";
      });

      return nextErrors;
    });
  };

  const handleInputChange = (fieldName) => (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: event.target.value,
    }));
    clearErrors(fieldName);
  };

  const togglePassword = (fieldName) => {
    setVisiblePasswords((prevVisiblePasswords) => ({
      ...prevVisiblePasswords,
      [fieldName]: !prevVisiblePasswords[fieldName],
    }));
  };

  const handleChangePasswordToggle = (event) => {
    const isChecked = event.target.checked;

    setChangePassword(isChecked);
    setSubmitErrorMessage("");

    if (!isChecked) {
      setFormValues((prevValues) => ({
        ...prevValues,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      }));
      setVisiblePasswords((prevVisiblePasswords) => ({
        ...prevVisiblePasswords,
        currentPassword: false,
        newPassword: false,
        newPasswordConfirm: false,
      }));
      clearErrors("currentPassword", "newPassword", "newPasswordConfirm");
    }
  };

  const validateForm = () => {
    const nextErrors = { ...initialErrors };
    const nickname = formValues.nickname.trim();
    const studyName = formValues.studyName.trim();
    const description = formValues.description.trim();
    const currentPassword = formValues.currentPassword;
    const newPassword = formValues.newPassword;
    const newPasswordConfirm = formValues.newPasswordConfirm;

    if (!nickname) nextErrors.nickname = "*닉네임을 입력해주세요";
    if (!studyName) nextErrors.studyName = "*스터디 이름을 입력해주세요";
    if (!description) nextErrors.description = "*소개를 입력해주세요";

    if (changePassword) {
      if (!currentPassword) nextErrors.currentPassword = "*현재 비밀번호를 입력해주세요";
      if (!newPassword) nextErrors.newPassword = "*새 비밀번호를 입력해주세요";

      if (!newPasswordConfirm) {
        nextErrors.newPasswordConfirm = "*새 비밀번호 확인을 입력해주세요";
      } else if (newPassword && newPassword !== newPasswordConfirm) {
        nextErrors.newPasswordConfirm = "*새 비밀번호가 일치하지 않습니다";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();

    setErrors(nextErrors);
    setSubmitErrorMessage("");

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const selectedBackgroundOption = (
      backgroundOptions.find((option) => option.id === selectedBackground) ?? backgroundOptions[0]
    );
    const payload = {
      nickname: formValues.nickname.trim(),
      name: formValues.studyName.trim(),
      description: formValues.description.trim(),
      backgroundType: selectedBackgroundOption.type,
      backgroundValue: selectedBackgroundOption.value,
    };

    if (changePassword) {
      payload.password = formValues.currentPassword;
      payload.newPassword = formValues.newPassword;
      payload.newPasswordConfirmation = formValues.newPasswordConfirm;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/study/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const result = await response.json();
      const updatedStudy = result?.data;

      setFormValues((prevValues) => ({
        ...prevValues,
        nickname: updatedStudy?.nickname ?? payload.nickname,
        studyName: updatedStudy?.name ?? payload.name,
        description: updatedStudy?.description ?? payload.description,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      }));
      setChangePassword(false);
      setVisiblePasswords({
        currentPassword: false,
        newPassword: false,
        newPasswordConfirm: false,
      });
      setErrors(initialErrors);
      showAlert("스터디가 수정되었습니다.");
      navigate(`/study/${id}`);
    } catch (error) {
      setSubmitErrorMessage(normalizeSubmitErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="study-create-page">
        <AlertMessage message="스터디 정보를 불러오는 중입니다." />
        <section className="study-create-card">
        </section>
      </main>
    );
  }

  if (pageErrorMessage) {
    return (
      <main className="study-create-page">
        <AlertMessage
          message={pageErrorMessage}
          variant="error"
          onClose={() => setPageErrorMessage("")}
        />
        <section className="study-create-card">
          <button className="study-create-submit" type="button" onClick={() => navigate("/")}>
            목록으로
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="study-create-page">
      <section className="study-create-card" aria-labelledby="study-edit-title">
        <form className="study-create-form" onSubmit={handleSubmit} noValidate>
          <div className="study-create-content">
            <h1 id="study-edit-title">스터디 수정하기</h1>

            <AlertMessage
              message={submitErrorMessage}
              variant="error"
              onClose={() => setSubmitErrorMessage("")}
            />

            <div className="study-create-field">
              <label htmlFor="nickname">닉네임</label>
              <div className="study-create-control">
                <input
                  id="nickname"
                  className={errors.nickname ? "is-error" : ""}
                  name="nickname"
                  type="text"
                  maxLength="30"
                  placeholder="닉네임을 입력해 주세요"
                  value={formValues.nickname}
                  aria-invalid={Boolean(errors.nickname)}
                  aria-describedby={errors.nickname ? "nickname-error" : undefined}
                  onChange={handleInputChange("nickname")}
                  required
                />
                {errors.nickname && (
                  <p id="nickname-error" className="study-create-error-message">{errors.nickname}</p>
                )}
              </div>
            </div>

            <div className="study-create-field">
              <label htmlFor="studyName">스터디 이름</label>
              <div className="study-create-control">
                <input
                  id="studyName"
                  className={errors.studyName ? "is-error" : ""}
                  name="studyName"
                  type="text"
                  maxLength="50"
                  placeholder="스터디 이름을 입력해주세요"
                  value={formValues.studyName}
                  aria-invalid={Boolean(errors.studyName)}
                  aria-describedby={errors.studyName ? "study-name-error" : undefined}
                  onChange={handleInputChange("studyName")}
                  required
                />
                {errors.studyName && (
                  <p id="study-name-error" className="study-create-error-message">{errors.studyName}</p>
                )}
              </div>
            </div>

            <div className="study-create-field">
              <label htmlFor="description">소개</label>
              <div className="study-create-control">
                <textarea
                  id="description"
                  className={errors.description ? "is-error" : ""}
                  name="description"
                  maxLength="200"
                  placeholder="소개 멘트를 작성해 주세요"
                  value={formValues.description}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  onChange={handleInputChange("description")}
                  required
                />
                {errors.description && (
                  <p id="description-error" className="study-create-error-message">{errors.description}</p>
                )}
              </div>
            </div>

            <fieldset className="study-create-background">
              <legend>배경을 선택해주세요</legend>
              <div className="study-create-background-grid">
                {backgroundOptions.map((option) => {
                  const isSelected = selectedBackground === option.id;

                  return (
                    <label className="study-create-background-option" key={option.id}>
                      <input
                        type="radio"
                        name="background"
                        value={option.value}
                        data-background-type={option.type}
                        checked={isSelected}
                        onChange={() => setSelectedBackground(option.id)}
                      />
                      <span
                        className={`study-create-background-tile ${option.className ?? ""}`}
                        aria-hidden="true"
                      >
                        {isSelected && <img src={selectedIcon} alt="" />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="study-create-field">
              <label className="study-edit-password-checkbox">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={handleChangePasswordToggle}
                />
                <span>비밀번호 변경</span>
              </label>
            </div>

            {changePassword && (
              <>
                <div className="study-create-field">
                  <label htmlFor="currentPassword">현재 비밀번호</label>
                  <div className="study-create-control">
                    <div className="study-create-password">
                      <input
                        id="currentPassword"
                        className={errors.currentPassword ? "is-error" : ""}
                        name="currentPassword"
                        type={visiblePasswords.currentPassword ? "text" : "password"}
                        placeholder="현재 비밀번호를 입력해 주세요"
                        value={formValues.currentPassword}
                        aria-invalid={Boolean(errors.currentPassword)}
                        aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
                        onChange={handleInputChange("currentPassword")}
                        required
                      />
                      <button
                        type="button"
                        className={`study-create-password-toggle ${
                          visiblePasswords.currentPassword ? "is-visible" : ""
                        }`}
                        aria-label={
                          visiblePasswords.currentPassword
                            ? "현재 비밀번호 숨기기"
                            : "현재 비밀번호 보기"
                        }
                        onClick={() => togglePassword("currentPassword")}
                      />
                    </div>
                    {errors.currentPassword && (
                      <p id="current-password-error" className="study-create-error-message">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="study-create-field">
                  <label htmlFor="newPassword">새 비밀번호</label>
                  <div className="study-create-control">
                    <div className="study-create-password">
                      <input
                        id="newPassword"
                        className={errors.newPassword ? "is-error" : ""}
                        name="newPassword"
                        type={visiblePasswords.newPassword ? "text" : "password"}
                        placeholder="새 비밀번호를 입력해 주세요"
                        value={formValues.newPassword}
                        aria-invalid={Boolean(errors.newPassword)}
                        aria-describedby={errors.newPassword ? "new-password-error" : undefined}
                        onChange={handleInputChange("newPassword")}
                      />
                      <button
                        type="button"
                        className={`study-create-password-toggle ${
                          visiblePasswords.newPassword ? "is-visible" : ""
                        }`}
                        aria-label={visiblePasswords.newPassword ? "새 비밀번호 숨기기" : "새 비밀번호 보기"}
                        onClick={() => togglePassword("newPassword")}
                      />
                    </div>
                    {errors.newPassword && (
                      <p id="new-password-error" className="study-create-error-message">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="study-create-field">
                  <label htmlFor="newPasswordConfirm">새 비밀번호 확인</label>
                  <div className="study-create-control">
                    <div className="study-create-password">
                      <input
                        id="newPasswordConfirm"
                        className={errors.newPasswordConfirm ? "is-error" : ""}
                        name="newPasswordConfirm"
                        type={visiblePasswords.newPasswordConfirm ? "text" : "password"}
                        placeholder="새 비밀번호를 다시 한 번 입력해 주세요"
                        value={formValues.newPasswordConfirm}
                        aria-invalid={Boolean(errors.newPasswordConfirm)}
                        aria-describedby={errors.newPasswordConfirm ? "new-password-confirm-error" : undefined}
                        onChange={handleInputChange("newPasswordConfirm")}
                      />
                      <button
                        type="button"
                        className={`study-create-password-toggle ${
                          visiblePasswords.newPasswordConfirm ? "is-visible" : ""
                        }`}
                        aria-label={
                          visiblePasswords.newPasswordConfirm
                            ? "새 비밀번호 확인 숨기기"
                            : "새 비밀번호 확인 보기"
                        }
                        onClick={() => togglePassword("newPasswordConfirm")}
                      />
                    </div>
                    {errors.newPasswordConfirm && (
                      <p id="new-password-confirm-error" className="study-create-error-message">
                        {errors.newPasswordConfirm}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="study-create-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "수정 중" : "수정하기"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default StudyEditPage;
