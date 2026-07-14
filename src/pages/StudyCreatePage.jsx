import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage.jsx';
import useAlert from '../components/useAlert.js';
import selectedIcon from '../assets/img/ic_bg_selected.png';
import './StudyCreatePage.css';

const API_BASE_URL = 'http://127.0.0.1:3000';

const backgroundOptions = [
  { id: 'green', type: 'color', value: '#E1EDDE', className: 'study-create-bg-green' },
  { id: 'yellow', type: 'color', value: '#FFF1CC', className: 'study-create-bg-yellow' },
  { id: 'blue', type: 'color', value: '#E0F1F5', className: 'study-create-bg-blue' },
  { id: 'pink', type: 'color', value: '#FDE0E9', className: 'study-create-bg-pink' },
  { id: 'desk', type: 'image', value: 'desk', className: 'study-create-bg-desk' },
  { id: 'window', type: 'image', value: 'window', className: 'study-create-bg-window' },
  { id: 'tiles', type: 'image', value: 'tiles', className: 'study-create-bg-tiles' },
  { id: 'leaves', type: 'image', value: 'leaves', className: 'study-create-bg-leaves' },
];

const initialErrors = {
  nickname: '',
  studyName: '',
  description: '',
  password: '',
  passwordConfirm: '',
};

const getStudyCreateErrorMessage = async (response) => {
  try {
    const result = await response.json();

    return result?.error?.message || result?.message || '스터디 생성에 실패했습니다.';
  } catch {
    return '스터디 생성에 실패했습니다.';
  }
};

const normalizeSubmitErrorMessage = (error) => {
  if (error.message === 'Failed to fetch') {
    return '서버에 연결할 수 없습니다. 백엔드 서버를 확인해주세요.';
  }

  return error.message || '스터디 생성에 실패했습니다.';
};

function StudyCreatePage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0].id);
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    passwordConfirm: false,
  });
  const [errors, setErrors] = useState(initialErrors);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrors = (...fieldNames) => {
    setSubmitErrorMessage('');

    setErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };

      fieldNames.forEach((fieldName) => {
        nextErrors[fieldName] = '';
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

    if (!nickname) nextErrors.nickname = '*닉네임을 입력해주세요';
    if (!studyName) nextErrors.studyName = '*스터디 이름을 입력해주세요';
    if (!description) nextErrors.description = '*소개를 입력해주세요';
    if (!password) nextErrors.password = '*비밀번호를 입력해주세요';

    if (!passwordConfirm) {
      nextErrors.passwordConfirm = '*비밀번호 확인을 입력해주세요';
    } else if (password && password !== passwordConfirm) {
      nextErrors.passwordConfirm = '*비밀번호가 일치하지 않습니다';
    }

    setErrors(nextErrors);
    setSubmitErrorMessage('');

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const selectedBackgroundOption = (
      backgroundOptions.find((option) => option.id === selectedBackground) ?? backgroundOptions[0]
    );

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/study`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          name: studyName,
          description,
          backgroundType: selectedBackgroundOption.type,
          backgroundValue: selectedBackgroundOption.value,
          password,
          passwordConfirmation: passwordConfirm,
        }),
      });

      if (!response.ok) {
        throw new Error(await getStudyCreateErrorMessage(response));
      }

      form.reset();
      setErrors(initialErrors);
      setSelectedBackground(backgroundOptions[0].id);
      setVisiblePasswords({ password: false, passwordConfirm: false });
      showAlert('스터디가 만들어졌습니다.');
      navigate('/');
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
        onClose={() => setSubmitErrorMessage('')}
      />

      <section className="study-create-card" aria-labelledby="study-create-title">
        <form className="study-create-form" onSubmit={handleSubmit} noValidate>
          <div className="study-create-content">
            <h1 id="study-create-title">스터디 만들기</h1>

            <div className="study-create-field">
              <label htmlFor="nickname">닉네임</label>
              <div className="study-create-control">
                <input
                  id="nickname"
                  className={errors.nickname ? 'is-error' : ''}
                  name="nickname"
                  type="text"
                  maxLength="30"
                  placeholder="닉네임을 입력해 주세요"
                  aria-invalid={Boolean(errors.nickname)}
                  aria-describedby={errors.nickname ? 'nickname-error' : undefined}
                  onChange={() => clearErrors('nickname')}
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
                  className={errors.studyName ? 'is-error' : ''}
                  name="studyName"
                  type="text"
                  maxLength="50"
                  placeholder="스터디 이름을 입력해주세요"
                  aria-invalid={Boolean(errors.studyName)}
                  aria-describedby={errors.studyName ? 'study-name-error' : undefined}
                  onChange={() => clearErrors('studyName')}
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
                  className={errors.description ? 'is-error' : ''}
                  name="description"
                  maxLength="200"
                  placeholder="소개 멘트를 작성해 주세요"
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                  onChange={() => clearErrors('description')}
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
                        className={`study-create-background-tile ${option.className ?? ''}`}
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
              <label htmlFor="password">비밀번호</label>
              <div className="study-create-control">
                <div className="study-create-password">
                  <input
                    id="password"
                    className={errors.password ? 'is-error' : ''}
                    name="password"
                    type={visiblePasswords.password ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해 주세요"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    onChange={() => clearErrors('password', 'passwordConfirm')}
                    required
                  />
                  <button
                    type="button"
                    className={`study-create-password-toggle ${visiblePasswords.password ? 'is-visible' : ''}`}
                    aria-label={visiblePasswords.password ? '비밀번호 숨기기' : '비밀번호 보기'}
                    onClick={() => togglePassword('password')}
                  />
                </div>
                {errors.password && (
                  <p id="password-error" className="study-create-error-message">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="study-create-field">
              <label htmlFor="passwordConfirm">비밀번호 확인</label>
              <div className="study-create-control">
                <div className="study-create-password">
                  <input
                    id="passwordConfirm"
                    className={errors.passwordConfirm ? 'is-error' : ''}
                    name="passwordConfirm"
                    type={visiblePasswords.passwordConfirm ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 한 번 입력해 주세요"
                    aria-invalid={Boolean(errors.passwordConfirm)}
                    aria-describedby={errors.passwordConfirm ? 'password-confirm-error' : undefined}
                    onChange={() => clearErrors('passwordConfirm')}
                    required
                  />
                  <button
                    type="button"
                    className={`study-create-password-toggle ${visiblePasswords.passwordConfirm ? 'is-visible' : ''}`}
                    aria-label={visiblePasswords.passwordConfirm ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                    onClick={() => togglePassword('passwordConfirm')}
                  />
                </div>
                {errors.passwordConfirm && (
                  <p id="password-confirm-error" className="study-create-error-message">{errors.passwordConfirm}</p>
                )}
              </div>
            </div>
          </div>

          <button className="study-create-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '만드는 중' : '만들기'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default StudyCreatePage;
