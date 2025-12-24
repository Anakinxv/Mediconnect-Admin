import LoginAsideimG from "@/assets/LoginAside.png";
import Logo from "@/assets//MediConnectLanding-green.png";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCButton from "@/shared/components/forms/MCButton";
import { AuthSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";

function Login() {
  const loginCredentials = useAppStore((state) => state.loginCredentials) ?? {
    email: "",
    password: "",
  };
  const setloginCredentials = useAppStore((state) => state.setloginCredentials);

  return (
    <section className="max-h-screen h-screen overflow-hidden w-full bg-white">
      <div className="grid grid-cols-[33%_67%] h-full w-full">
        <main className="flex flex-col justify-center items-center px-8">
          <div className="flex flex-col justify-center items-center gap-1 mb-2 ">
            <img src={Logo} alt="Logo" className="w-32 mb-6" />
            <h1 className="text-4xl font-bold text-center">Bienvenido</h1>
            <p className="text-xl text-center text-muted-foreground">
              Iniciar sesión en MediConnect
            </p>{" "}
          </div>
          <MCFormWrapper
            schema={AuthSchema}
            onSubmit={(data) => {
              console.log("Login data:", data);
            }}
            defaultValues={{
              email: loginCredentials.email,
              password: loginCredentials.password,
            }}
            className=" w-full max-w-sm rounded-lg p-4 flex flex-col"
          >
            <MCInput
              type="email"
              name="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo"
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
              label="Contraseña"
              name="password"
              placeholder="Ingresa tu contraseña"
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
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <MCButton type="submit" className="w-full " variant="primary">
              Iniciar sesión
            </MCButton>
          </MCFormWrapper>
          <div className="mt-3 text-center">
            <span className="text-base text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <a
                href="#"
                className="text-primary font-semibold hover:underline"
              >
                Regístrate
              </a>
            </span>
          </div>
        </main>
        <aside className="h-full w-full">
          <img
            src={LoginAsideimG}
            alt="Login Aside"
            className="h-full w-full object-cover"
          />
        </aside>
      </div>
    </section>
  );
}

export default Login;
