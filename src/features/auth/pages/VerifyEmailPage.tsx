import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../components/AuthContentContainer";
import MCOtpInput from "@/shared/components/forms/MCOtpInput";
import { OtpSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../components/AuthFooterContainer";
import MCButton from "@/shared/components/forms/MCButton";
function VerifyEmailPage() {
  const { t } = useTranslation("auth");

  const confirmedEmail = useAppStore((state) => state.forgotPassword.email);
  const otpData = useAppStore((state) => state.otp);
  const setOtp = useAppStore((state) => state.setOtp);

  return (
    <AuthContentContainer
      title={t("verifyEmail.title")}
      subtitle={
        <div>
          {t("verifyEmail.subtitle")}
          <br />
          <span className="font-semibold text-primary">{confirmedEmail}</span>
        </div>
      }
    >
      <MCFormWrapper
        schema={OtpSchema((key) => t(key))}
        onSubmit={(data) => {
          console.log("OTP Data:", data);
        }}
        defaultValues={{ otp: otpData }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCOtpInput
            onChange={(value) => {
              setOtp(value);
            }}
          />
          <p className="text-center mt-2 w-full">{otpData}</p>
        </div>
        <div className="w-md max-w-md m-4 flex flex-col items-center gap-4">
          <p className="text-md text-primary/80  mb-2 text-center">
            <span className="font-semibold text-primary">
              {t("verifyEmail.tip").split(":")[0]}:
            </span>{" "}
            {t("verifyEmail.tip").split(":")[1]}
          </p>
          <MCButton variant="tercero" size="m">
            {t("verifyEmail.resend")}
          </MCButton>
        </div>
        <AuthFooterContainer
          backButtonProps={{
            disabled: false,
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default VerifyEmailPage;
