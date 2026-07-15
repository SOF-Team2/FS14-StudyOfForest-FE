import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import AlertMessage from "../components/AlertMessage.jsx";
import BackgroundSelector from "../components/study/BackgroundSelector.jsx";
import useAlert from "../components/useAlert.js";
import {
  backgroundOptions,
  createDefaultCustomBackground,
  getBackgroundPayload,
} from "../utils/studyBackground.js";

const initialErrors = {
  nickname: "",
  studyName: "",
  description: "",
  password: "",
  passwordConfirm: "",
};

const normalizeSubmitErrorMessage = (error) => {
  const serverMessage =
    error.response?.data?.error?.message ||
    error.response?.data?.message;

  if (serverMessage) {
    return serverMessage;
  }

  if (error.message === "Failed to fetch" || error.message === "Network Error") {
    return "서버에 연결할 수 없습니다. 백엔드 서버를 확인해주세요.";
  }

  return error.message || "스터디 생성에 실패했습니다.";
};

function StudyCreatePage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [selectedBackground, setSelectedBackground] = useState(
    backgroundOptions[0].id,
  );
  const [customBackground, setCustomBackground] = useState(
    createDefaultCustomBackground,
  );
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    passwordConfirm: false,
  });
  const [errors, setErrors] = useState(initialErrors);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const togglePassword = (fieldName) => {
    setVisiblePasswords((prevVisiblePasswords) => ({
      ...prevVisiblePasswords,
      [fieldName]: !prevVisiblePasswords[fieldName],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const nextErrors = { ...initialErrors };
    const nickname = form.nickname.value.trim();
    const studyName = form.studyName.value.trim();
    const description = form.description.value.trim();
    const password = form.password.value;
    const passwordConfirm = form.passwordConfirm.value;

    if (!nickname) nextErrors.nickname = "*닉네임을 입력해주세요";
    if (!studyName) nextErrors.studyName = "*스터디 이름을 입력해주세요";
    if (!description) nextErrors.description = "*소개를 입력해주세요";
    if (!password) nextErrors.password = "*비밀번호를 입력해주세요";

    if (!passwordConfirm) {
      nextErrors.passwordConfirm = "*비밀번호 확인을 입력해주세요";
    } else if (password && password !== passwordConfirm) {
      nextErrors.passwordConfirm = "*비밀번호가 일치하지 않습니다";
    }

    setErrors(nextErrors);
    setSubmitErrorMessage("");

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const backgroundPayload = getBackgroundPayload(
      selectedBackground,
      customBackground,
    );

    if (!backgroundPayload) {
      setSubmitErrorMessage("업로드한 배경 사진을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/study", {
        nickname,
        name: studyName,
        description,
        backgroundType: backgroundPayload.type,
        backgroundValue: backgroundPayload.value,
        password,
        passwordConfirmation: passwordConfirm,
      });

      form.reset();
      setErrors(initialErrors);
      setSelectedBackground(backgroundOptions[0].id);
      setCustomBackground(createDefaultCustomBackground());
      setVisiblePasswords({ password: false, passwordConfirm: false });
      showAlert("스터디가 만들어졌습니다.");
      navigate(`/study/${response.data.data.id}`);
    } catch (error) {
      setSubmitErrorMessage(normalizeSubmitErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="study-create-page">
      <AlertMessage
        message={submitErrorMessage}
        variant="error"
        onClose={() => setSubmitErrorMessage("")}
      />

      <section
        className="study-create-card"
        aria-labelledby="study-create-title"
      >
        <form className="study-create-form" onSubmit={handleSubmit} noValidate>
          <div className="study-create-content">
            <h1 id="study-create-title">스터디 만들기</h1>

            <div className="study-create-field study-create-field--nickname">
              <label htmlFor="nickname">닉네임</label>
              <div className="study-create-control">
                <input
                  id="nickname"
                  className={errors.nickname ? "is-error" : ""}
                  name="nickname"
                  type="text"
                  maxLength="30"
                  placeholder="닉네임을 입력해 주세요"
                  aria-invalid={Boolean(errors.nickname)}
                  aria-describedby={
                    errors.nickname ? "nickname-error" : undefined
                  }
                  onChange={() => clearErrors("nickname")}
                  required
                />
                {errors.nickname && (
                  <p id="nickname-error" className="study-create-error-message">
                    {errors.nickname}
                  </p>
                )}
              </div>
            </div>

            <div className="study-create-field study-create-field--study-name">
              <label htmlFor="studyName">스터디 이름</label>
              <div className="study-create-control">
                <input
                  id="studyName"
                  className={errors.studyName ? "is-error" : ""}
                  name="studyName"
                  type="text"
                  maxLength="50"
                  placeholder="스터디 이름을 입력해주세요"
                  aria-invalid={Boolean(errors.studyName)}
                  aria-describedby={
                    errors.studyName ? "study-name-error" : undefined
                  }
                  onChange={() => clearErrors("studyName")}
                  required
                />
                {errors.studyName && (
                  <p
                    id="study-name-error"
                    className="study-create-error-message"
                  >
                    {errors.studyName}
                  </p>
                )}
              </div>
            </div>

            <div className="study-create-field study-create-field--description">
              <label htmlFor="description">소개</label>
              <div className="study-create-control">
                <textarea
                  id="description"
                  className={errors.description ? "is-error" : ""}
                  name="description"
                  maxLength="200"
                  placeholder="소개 멘트를 작성해 주세요"
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  onChange={() => clearErrors("description")}
                  required
                />
                {errors.description && (
                  <p
                    id="description-error"
                    className="study-create-error-message"
                  >
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <BackgroundSelector
              selectedBackground={selectedBackground}
              customBackground={customBackground}
              onSelectedBackgroundChange={setSelectedBackground}
              onCustomBackgroundChange={setCustomBackground}
              onError={setSubmitErrorMessage}
            />

            <div className="study-create-field study-create-field--password">
              <label htmlFor="password">비밀번호</label>
              <div className="study-create-control">
                <div className="study-create-password">
                  <input
                    id="password"
                    className={errors.password ? "is-error" : ""}
                    name="password"
                    type={visiblePasswords.password ? "text" : "password"}
                    placeholder="비밀번호를 입력해 주세요"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    onChange={() => clearErrors("password", "passwordConfirm")}
                    required
                  />
                  <button
                    type="button"
                    className={`study-create-password-toggle ${visiblePasswords.password ? "is-visible" : ""}`}
                    aria-label={
                      visiblePasswords.password
                        ? "비밀번호 숨기기"
                        : "비밀번호 보기"
                    }
                    onClick={() => togglePassword("password")}
                  />
                </div>
                {errors.password && (
                  <p id="password-error" className="study-create-error-message">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="study-create-field study-create-field--password-confirm">
              <label htmlFor="passwordConfirm">비밀번호 확인</label>
              <div className="study-create-control">
                <div className="study-create-password">
                  <input
                    id="passwordConfirm"
                    className={errors.passwordConfirm ? "is-error" : ""}
                    name="passwordConfirm"
                    type={
                      visiblePasswords.passwordConfirm ? "text" : "password"
                    }
                    placeholder="비밀번호를 다시 한 번 입력해 주세요"
                    aria-invalid={Boolean(errors.passwordConfirm)}
                    aria-describedby={
                      errors.passwordConfirm
                        ? "password-confirm-error"
                        : undefined
                    }
                    onChange={() => clearErrors("passwordConfirm")}
                    required
                  />
                  <button
                    type="button"
                    className={`study-create-password-toggle ${visiblePasswords.passwordConfirm ? "is-visible" : ""}`}
                    aria-label={
                      visiblePasswords.passwordConfirm
                        ? "비밀번호 확인 숨기기"
                        : "비밀번호 확인 보기"
                    }
                    onClick={() => togglePassword("passwordConfirm")}
                  />
                </div>
                {errors.passwordConfirm && (
                  <p
                    id="password-confirm-error"
                    className="study-create-error-message"
                  >
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            className="study-create-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "만드는 중" : "만들기"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default StudyCreatePage;
