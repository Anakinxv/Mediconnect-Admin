import LoginAsideimG from "@/assets/LoginAside.png";
import Logo from "@/assets//MediConnectLanding-green.png";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCButton from "@/shared/components/forms/MCButton";
import { LoginSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { type AuthType } from "@/types/AuthTypes";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import LanguageDropDown from "../components/LanguageDropDown";
function Login() {
  const { t } = useTranslation("auth");
  const isMobile = useIsMobile();
  const loginCredentials = useAppStore((state) => state.loginCredentials);
  const setloginCredentials = useAppStore((state) => state.setloginCredentials);
  const handleSubmit = (data: AuthType) => {
    setloginCredentials(data);
    console.log("Login data:", data);
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
              value={loginCredentials.email}
              onChange={(e) =>
                setloginCredentials({
                  ...loginCredentials,
                  email: e.target.value,
                })
              }
            />
            <MCInput
              type="password"
              label={t("login.password")}
              name="password"
              placeholder={t("login.passwordPlaceholder")}
              value={loginCredentials.password}
              onChange={(e) =>
                setloginCredentials({
                  ...loginCredentials,
                  password: e.target.value,
                })
              }
            />
            <div className="flex justify-end w-full mb-4">
              <a
                href="#"
                className="text-base text-primary font-semibold hover:underline"
              >
                {t("login.forgot")}
              </a>
            </div>
            <MCButton type="submit" className="w-full " variant="primary">
              {t("login.submit")}
            </MCButton>
            <LanguageDropDown></LanguageDropDown>
          </MCFormWrapper>
          <div className="mt-3 text-center">
            <span className="text-base text-muted-foreground">
              {t("login.noAccount")}{" "}
              <a
                href="#"
                className="text-primary font-semibold hover:underline"
              >
                {t("login.register")}
              </a>
            </span>
          </div>
        </main>
        {!isMobile && (
          <aside className="h-full w-full">
            <img
              src={LoginAsideimG}
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
