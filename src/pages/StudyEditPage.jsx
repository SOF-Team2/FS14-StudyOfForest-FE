import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios.js";
import AlertMessage from "../components/AlertMessage.jsx";
import BackgroundSelector from "../components/study/BackgroundSelector.jsx";
import useAlert from "../components/useAlert.js";
import {
  backgroundOptions,
  createDefaultCustomBackground,
  getBackgroundPayload,
  getBackgroundSelectionFromStudy,
} from "../utils/studyBackground.js";

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

  return error.message || "스터디 수정에 실패했습니다.";
};

function StudyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0].id);
  const [customBackground, setCustomBackground] = useState(
    createDefaultCustomBackground,
  );
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
        const response = await axios.get(`/study/${id}`, {
          signal: controller.signal,
        });
        const result = response.data;
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
        const backgroundSelection = getBackgroundSelectionFromStudy(study);

        setSelectedBackground(backgroundSelection.selectedBackground);
        setCustomBackground(backgroundSelection.customBackground);
      } catch (error) {
        if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
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

    const backgroundPayload = getBackgroundPayload(
      selectedBackground,
      customBackground,
    );

    if (!backgroundPayload) {
      setSubmitErrorMessage("업로드한 배경 사진을 확인해주세요.");
      return;
    }

    const payload = {
      nickname: formValues.nickname.trim(),
      name: formValues.studyName.trim(),
      description: formValues.description.trim(),
      backgroundType: backgroundPayload.type,
      backgroundValue: backgroundPayload.value,
    };

    if (changePassword) {
      payload.password = formValues.currentPassword;
      payload.newPassword = formValues.newPassword;
      payload.newPasswordConfirmation = formValues.newPasswordConfirm;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch(`/study/${id}`, payload);
      const result = response.data;
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

            <div className="study-create-field study-create-field--description">
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

            <BackgroundSelector
              selectedBackground={selectedBackground}
              customBackground={customBackground}
              onSelectedBackgroundChange={setSelectedBackground}
              onCustomBackgroundChange={setCustomBackground}
              onError={setSubmitErrorMessage}
            />

            <div className="study-create-field study-create-field--password-toggle">
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
                <div className="study-create-field study-create-field--current-password">
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

                <div className="study-create-field study-create-field--new-password">
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

                <div className="study-create-field study-create-field--new-password-confirm">
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
