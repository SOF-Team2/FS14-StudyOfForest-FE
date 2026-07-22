import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import AlertMessage from "../components/AlertMessage.jsx";
import BackgroundSelector from "../components/study/BackgroundSelector.jsx";
import useAlert from "../components/useAlert.js";
import useCurrentUser from "../components/useCurrentUser.js";
import {
  backgroundOptions,
  createDefaultCustomBackground,
  getBackgroundPayload,
} from "../utils/studyBackground.js";

const initialErrors = {
  studyName: "",
  description: "",
};

const initialFormValues = {
  studyName: "",
  description: "",
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
  const currentUser = useCurrentUser();
  const [selectedBackground, setSelectedBackground] = useState(
    backgroundOptions[0].id,
  );
  const [customBackground, setCustomBackground] = useState(
    createDefaultCustomBackground,
  );
  const [formValues, setFormValues] = useState(initialFormValues);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = { ...initialErrors };
    const studyName = formValues.studyName.trim();
    const description = formValues.description.trim();

    if (!studyName) nextErrors.studyName = "*스터디 이름을 입력해주세요";
    if (!description) nextErrors.description = "*소개를 입력해주세요";

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
        name: studyName,
        description,
        backgroundType: backgroundPayload.type,
        backgroundValue: backgroundPayload.value,
      });

      setFormValues(initialFormValues);
      setErrors(initialErrors);
      setSelectedBackground(backgroundOptions[0].id);
      setCustomBackground(createDefaultCustomBackground());
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
                  aria-describedby={
                    errors.studyName ? "study-name-error" : undefined
                  }
                  onChange={(event) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      studyName: event.target.value,
                    }));
                    clearErrors("studyName");
                  }}
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
                  value={formValues.description}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  onChange={(event) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      description: event.target.value,
                    }));
                    clearErrors("description");
                  }}
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
              previewStudy={{
                nickname: currentUser?.nickname,
                name: formValues.studyName,
                description: formValues.description,
              }}
            />

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
