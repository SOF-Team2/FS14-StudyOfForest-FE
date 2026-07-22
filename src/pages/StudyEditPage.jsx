import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios.js";
import AlertMessage from "../components/AlertMessage.jsx";
import BackgroundSelector from "../components/study/BackgroundSelector.jsx";
import useAlert from "../components/useAlert.js";
import useCurrentUser from "../components/useCurrentUser.js";
import {
  backgroundOptions,
  createDefaultCustomBackground,
  getBackgroundPayload,
  getBackgroundSelectionFromStudy,
} from "../utils/studyBackground.js";

const initialFormValues = {
  studyName: "",
  description: "",
};

const initialErrors = {
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

  return error.message || "스터디 수정에 실패했습니다.";
};

function StudyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const currentUser = useCurrentUser();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0].id);
  const [customBackground, setCustomBackground] = useState(
    createDefaultCustomBackground,
  );
  const [previewStudy, setPreviewStudy] = useState({});
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
        const study = response.data?.data ?? response.data;

        if (!study) {
          throw new Error("스터디 정보를 불러오지 못했습니다.");
        }

        if (!study.isOwner) {
          showAlert("스터디 생성자만 수정할 수 있습니다.", "error");
          navigate(`/study/${id}`, { replace: true });
          return;
        }

        setFormValues({
          studyName: study.name ?? "",
          description: study.description ?? "",
        });
        setPreviewStudy(study);
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
  }, [id, navigate, showAlert]);

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

  const validateForm = () => {
    const nextErrors = { ...initialErrors };
    const studyName = formValues.studyName.trim();
    const description = formValues.description.trim();

    if (!studyName) nextErrors.studyName = "*스터디 이름을 입력해주세요";
    if (!description) nextErrors.description = "*소개를 입력해주세요";

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
      name: formValues.studyName.trim(),
      description: formValues.description.trim(),
      backgroundType: backgroundPayload.type,
      backgroundValue: backgroundPayload.value,
    };

    setIsSubmitting(true);

    try {
      const response = await axios.patch(`/study/${id}`, payload);
      const result = response.data;
      const updatedStudy = result?.data;

      setFormValues((prevValues) => ({
        ...prevValues,
        studyName: updatedStudy?.name ?? payload.name,
        description: updatedStudy?.description ?? payload.description,
      }));
      setPreviewStudy((prevStudy) => ({
        ...prevStudy,
        ...updatedStudy,
        name: updatedStudy?.name ?? payload.name,
        description: updatedStudy?.description ?? payload.description,
      }));
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
              previewStudy={{
                ...previewStudy,
                nickname: currentUser?.nickname ?? previewStudy.nickname,
                name: formValues.studyName,
                description: formValues.description,
              }}
            />
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
