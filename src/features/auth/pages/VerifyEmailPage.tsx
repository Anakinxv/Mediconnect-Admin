import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../components/AuthContentContainer";
import MCOtpInput from "@/shared/components/forms/MCOtpInput";
import { OtpSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../components/AuthFooterContainer";

function VerifyEmailPage() {
  const { t } = useTranslation("auth");

  const confirmedEmail = useAppStore((state) => state.forgotPassword.email);
  const otpData = useAppStore((state) => state.otp);
  const setOtp = useAppStore((state) => state.setOtp);

  return (
    <div className="h-full flex justify-center items-center">
      <AuthContentContainer
        title="Verifica tu correo electrónico"
        subtitle={
          <>
            Introdúcelo a continuación para confirmar tu correo:
            <br />
            <span className="font-semibold">{confirmedEmail}</span>
          </>
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
          <AuthFooterContainer
            backButtonProps={{
              disabled: false,
            }}
          />
        </MCFormWrapper>
      </AuthContentContainer>
    </div>
  );
}

export default VerifyEmailPage;
