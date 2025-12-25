import LoginAsideImg from "@/assets/LoginAside.png";
import Logo from "@/assets//MediConnectLanding-green.png";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCButton from "@/shared/components/forms/MCButton";
import { LoginSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { type LoginSchemaType } from "@/schema/AuthSchema";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import LanguageDropDown from "../components/LanguageDropDown";
import { useNavigate } from "react-router-dom";
function Login() {
  const { t } = useTranslation("auth");
  const isMobile = useIsMobile();
  const loginCredentials = useAppStore((state) => state.loginCredentials);
  const setLoginCredentials = useAppStore((state) => state.setLoginCredentials);
  const navigate = useNavigate();

  const handleSubmit = (data: LoginSchemaType) => {
    // Validación simple: ambos campos deben tener valor
    if (data.email && data.password) {
      setLoginCredentials({ email: data.email, password: data.password });
      navigate("/dashboard/home");
    } else {
      // Aquí podrías mostrar un error si lo deseas
      alert(t("login.errorFields")); // Asegúrate de tener esta traducción
    }
  };
  return (
    <section className="max-h-screen h-screen overflow-hidden w-full bg-white">
      <div
        className={`h-full w-full ${
          isMobile ? "" : "grid grid-cols-[33%_67%]"
        }`}
      >
        <main
          className={`flex flex-col justify-center items-center px-8 ${
            isMobile ? "min-h-screen justify-center items-center" : ""
          }`}
        >
          <div className="flex flex-col justify-center items-center gap-1 mb-2 ">
            <img src={Logo} alt="Logo" className="w-32 mb-6" />
            <h1 className="text-4xl font-bold text-center">
              {t("login.welcome")}
            </h1>
            <p className="text-xl text-center text-muted-foreground">
              {t("login.subtitle")}
            </p>
          </div>
          <MCFormWrapper
            schema={LoginSchema(t)}
            onSubmit={handleSubmit}
            defaultValues={{
              email: loginCredentials.email,
              password: loginCredentials.password,
            }}
            className=" w-full max-w-sm rounded-lg p-4 flex flex-col"
          >
            <MCInput
              type="email"
              name="email"
              label={t("login.email")}
              placeholder={t("login.emailPlaceholder")}
            />
            <MCInput
              type="password"
              label={t("login.password")}
              name="password"
              placeholder={t("login.passwordPlaceholder")}
            />
            <div className="flex justify-end w-full mb-4">
              <a
                className="text-base text-primary font-semibold hover:underline"
                onClick={() => navigate("/auth/forgot-password")}
              >
                {t("login.forgot")}
              </a>
            </div>
            <MCButton type="submit" className="w-full " variant="primary">
              {t("login.submit")}
            </MCButton>
            <LanguageDropDown></LanguageDropDown>
          </MCFormWrapper>
        </main>
        {!isMobile && (
          <aside className="h-full w-full">
            <img
              src={LoginAsideImg}
              alt="Login Aside"
              className="h-full w-full object-cover"
            />
          </aside>
        )}
      </div>
    </section>
  );
}

export default Login;
