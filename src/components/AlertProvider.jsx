import { useCallback, useEffect, useMemo, useState } from "react";
import AlertMessage from "./AlertMessage.jsx";
import AlertContext from "./alertContext.js";

const ALERT_VISIBLE_DURATION = 3200;
const ALERT_FADE_DURATION = 400;

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    message: "",
    variant: "success",
    status: "hidden",
  });

  useEffect(() => {
    if (alert.status === "hidden") {
      return undefined;
    }

    if (alert.status === "visible") {
      const visibleTimer = window.setTimeout(() => {
        setAlert((currentAlert) => ({ ...currentAlert, status: "closing" }));
      }, ALERT_VISIBLE_DURATION);

      return () => window.clearTimeout(visibleTimer);
    }

    const closeTimer = window.setTimeout(() => {
      setAlert((currentAlert) => ({ ...currentAlert, status: "hidden" }));
    }, ALERT_FADE_DURATION);

    return () => window.clearTimeout(closeTimer);
  }, [alert.status]);

  const showAlert = useCallback((message, variant = "success") => {
    setAlert({
      message,
      variant,
      status: "visible",
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert((currentAlert) => (
      currentAlert.status === "hidden"
        ? currentAlert
        : { ...currentAlert, status: "closing" }
    ));
  }, []);

  const contextValue = useMemo(() => ({
    showAlert,
    closeAlert,
  }), [showAlert, closeAlert]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <AlertMessage
        message={alert.message}
        variant={alert.variant}
        status={alert.status}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
}
