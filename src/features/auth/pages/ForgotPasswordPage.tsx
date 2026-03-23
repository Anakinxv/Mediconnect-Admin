import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useDebounce } from "use-debounce";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { ForgotPasswordSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../components/AuthFooterContainer";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { useForgotPassword } from "../hooks/useForgotPassword";

type InputStatus = "default" | "error" | "success" | "warning" | "loading";

function LoginEmailRegex(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ForgotPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const forgotPasswordData = useAppStore((state) => state.forgotPassword);
  const setForgotPassword = useAppStore((state) => state.setForgotPassword);

  const [emailValue, setEmailValue] = useState(forgotPasswordData?.email || "");
  const [debouncedEmail] = useDebounce(emailValue.trim(), 700);

  const [emailStatus, setEmailStatus] = useState<InputStatus>("default");
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);

  const lastSuccessEmailRef = useRef("");

  const { mutateAsync: requestCode, isPending } = useForgotPassword();

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!debouncedEmail) {
        if (!isMounted) return;
        setEmailStatus("default");
        setEmailStatusMessage("");
        setEmailValidated(false);
        return;
      }

      // Solo verifica existencia si el email es válido
      if (!LoginEmailRegex(debouncedEmail)) {
        if (!isMounted) return;
        setEmailStatus("default");
        setEmailStatusMessage("");
        setEmailValidated(false);
        return;
      }

      if (lastSuccessEmailRef.current === debouncedEmail) {
        if (!isMounted) return;
        setEmailStatus("success");
        setEmailStatusMessage(
          t(
            "forgotPassword.emailRegistered",
            "Correo válido. Puedes continuar.",
          ),
        );
        setEmailValidated(true);
        return;
      }

      try {
        setEmailStatus("loading");
        setEmailStatusMessage(
          t("forgotPassword.checkingEmail", "Verificando correo..."),
        );

        await requestCode({ email: debouncedEmail });

        if (!isMounted) return;
        lastSuccessEmailRef.current = debouncedEmail;
        setEmailStatus("success");
        setEmailStatusMessage(
          t("forgotPassword.codeSent", "Código enviado. Puedes continuar."),
        );
        setEmailValidated(true);
      } catch (error) {
        if (!isMounted) return;
        const err = error as AxiosError<{ message?: string }>;
        setEmailStatus("error");
        setEmailStatusMessage(
          err.response?.data?.message ||
            t(
              "forgotPassword.emailNotFound",
              "No existe un usuario registrado con este correo.",
            ),
        );
        setEmailValidated(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [debouncedEmail, requestCode, t]);

  const handlesubmit = async (data: { email: string }) => {
    const normalizedEmail = data.email.trim();

    if (!emailValidated || lastSuccessEmailRef.current !== normalizedEmail) {
      setEmailStatus("error");
      setEmailStatusMessage(
        t(
          "forgotPassword.mustValidateEmail",
          "Primero valida un correo registrado.",
        ),
      );
      return;
    }

    setForgotPassword({
      ...forgotPasswordData,
      email: normalizedEmail,
    });

    navigate(ROUTES.VERIFY_EMAIL, { replace: true });
  };

  return (
    <AuthContentContainer
      title={t("forgotPassword.title")}
      subtitle={t("forgotPassword.subtitle")}
    >
      <MCFormWrapper
        schema={ForgotPasswordSchema((key) => t(key))}
        onSubmit={(data) => {
          void handlesubmit(data);
        }}
        defaultValues={{
          email: forgotPasswordData?.email || "",
        }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCInput
            name="email"
            type="email"
            label={t("forgotPassword.emailLabel")}
            placeholder={t("forgotPassword.emailPlaceholder")}
            onChange={(e) => setEmailValue(e.target.value)}
            status={isPending ? "loading" : emailStatus}
            statusMessage={emailStatusMessage}
          />
        </div>

        <AuthFooterContainer
          backButtonProps={{ disabled: true }}
          continueButtonProps={{
            disabled: !emailValidated || isPending,
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default ForgotPasswordPage;
