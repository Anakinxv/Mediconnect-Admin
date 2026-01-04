import { Sheet, SheetContent, SheetClose } from "@/shared/ui/sheet";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { X, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import MCButton from "./forms/MCButton";
import MCInput from "./forms/MCInput";
import { useState, useRef } from "react";
import MCFormWrapper from "./forms/MCFormWrapper";
import { profileSchema } from "@/schema/UserSchema";
import MCProfileImageUploader from "./MCProfileImageUploader";

interface MCSheetProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CropType = "banner" | "profile";

function MCSheetProfile({ open, onOpenChange }: MCSheetProfileProps) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
  });
  const [banner, setBanner] = useState<string>(
    "https://i.pinimg.com/736x/3b/37/46/3b3746e0878804293202d56d1dda1fe1.jpg"
  );
  const [profile, setProfile] = useState<string>(
    "https://i.pinimg.com/736x/ee/27/85/ee278567d7a890bb390e5a99a4df4936.jpg"
  );

  // Estados para crop modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropType, setCropType] = useState<CropType>("profile");
  const [tempImage, setTempImage] = useState<string>("");

  // Refs para inputs file
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Cuando el usuario selecciona una imagen, abrir crop modal
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: CropType
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTempImage(ev.target?.result as string);
        setCropType(type);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Limpiar el input para permitir volver a seleccionar la misma imagen si se desea
    e.target.value = "";
  };

  // Cuando se confirma el crop
  const handleCropComplete = (croppedImage: string) => {
    if (cropType === "banner") setBanner(croppedImage);
    else setProfile(croppedImage);
  };

  const handleSubmit = () => {
    console.log("Datos guardados:", formData);
  };

  return (
    <>
      {/* Modal de crop */}
      <MCProfileImageUploader
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={tempImage}
        aspectRatio={cropType === "banner" ? 3.5 : 1}
        isCircular={cropType === "profile"}
        onCropComplete={handleCropComplete}
        title={
          cropType === "banner" ? "Recortar banner" : "Recortar foto de perfil"
        }
      />

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          role="dialog"
          aria-modal="true"
          aria-labelledby="mc-sheet-title"
          aria-describedby="mc-sheet-desc"
          className={
            isMobile
              ? "inset-y-0 my-2.5 flex items-center justify-center h-[calc(100%-20px)] w-[calc(100vw-10px)] ml-[10px] rounded-l-4xl border-accent"
              : "w-1/1.5 border-accent inset-y-0 my-2.5 flex items-center justify-center h-[calc(100%-20px)] rounded-l-4xl"
          }
        >
          <Tabs className="grid grid-cols-[35%_65%] h-full w-full">
            <aside
              className="w-full h-full rounded-l-4xl bg-accent/30 border-r-3 border-accent py-6 m-0 flex flex-col gap-4 "
              role="navigation"
              aria-label="Opciones de edición de perfil"
            >
              <div className="w-full px-10 mt-6 flex flex-col gap-2">
                <h1 id="mc-sheet-title" className="text-xl font-medium">
                  Editar Perfil
                </h1>
                <p id="mc-sheet-desc" className="text-base max-w-50 text-left">
                  Modifica tu Información profesional
                </p>
              </div>

              <TabsList
                className="flex flex-col gap-2 w-full justify-center items-center px-6  h-fit"
                role="tablist"
                aria-label="Secciones de perfil"
              >
                <TabsTrigger
                  value="info"
                  role="tab"
                  aria-controls="info-panel"
                  className="text-md rounded-full "
                >
                  <div className="flex items-center gap-2 p-2 rounded-full">
                    <User className="h-12 w-auto stroke-2" />
                    <span className="text-base font-medium">
                      Información profesional
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </aside>

            <main className="w-full h-full overflow-y-auto">
              <div className="flex items-center justify-end p-2">
                <SheetClose asChild>
                  <button
                    className="rounded-full h-8 w-8 flex items-center border-none outline-none ring-none justify-center hover:bg-accent/70 focus:bg-accent active:scale-95 transition-all duration-200"
                    aria-label="Cerrar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </SheetClose>
              </div>

              <div className="flex items-center border-b-2 border-border mx-4">
                <h2 className="text-2xl font-medium px-5 ">
                  Información General
                </h2>
              </div>

              <div className="px-10 py-6">
                <TabsContent
                  value="info"
                  id="info-panel"
                  role="tabpanel"
                  aria-labelledby="info-tab"
                >
                  <MCFormWrapper
                    schema={profileSchema}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    {/* Imagen de Banner */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-medium">Imagen de Banner</h3>
                      <label
                        className="relative w-full h-40 bg-accent/30 rounded-2xl overflow-hidden cursor-pointer group"
                        onClick={() => bannerInputRef.current?.click()}
                      >
                        <img
                          src={banner}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, "banner")}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-semibold text-lg">
                            Cambiar imagen
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Foto de perfil */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-medium">Foto de perfil</h3>
                      <div className="flex items-center gap-4">
                        <label
                          className="relative w-32 h-32 rounded-full bg-accent/30 overflow-hidden cursor-pointer group"
                          onClick={() => profileInputRef.current?.click()}
                        >
                          <img
                            src={profile}
                            alt="Perfil"
                            className="w-full h-full object-cover"
                          />
                          <input
                            ref={profileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, "profile")}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <span className="text-white font-semibold text-sm">
                              Cambiar imagen
                            </span>
                          </div>
                        </label>
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground">
                            Recomendado: 400x400px, formato JPG o PNG
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Nombre Completo */}
                    <MCInput
                      name="nombre"
                      label="Nombre Completo"
                      type="text"
                      placeholder="Ingresa tu nombre completo"
                      value={formData.nombre}
                      onChange={(e) =>
                        handleInputChange("nombre", e.target.value)
                      }
                    />

                    {/* Especialidad */}
                    <MCInput
                      name="rol"
                      label="Especialidad"
                      type="text"
                      placeholder="Ej: Cardiología"
                      value={formData.rol}
                    />

                    {/* Email */}
                    <MCInput
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                    />

                    {/* Teléfono */}
                    <MCInput
                      name="telefono"
                      label="Teléfono"
                      type="tel"
                      placeholder="+52 123 456 7890"
                      value={formData.telefono}
                    />

                    {/* Botones de acción */}
                    <div className="flex gap-3 mt-4">
                      <MCButton
                        variant="primary"
                        size="m"
                        onClick={handleSubmit}
                      >
                        Guardar cambios
                      </MCButton>
                      <MCButton
                        variant="secondary"
                        size="m"
                        onClick={() => onOpenChange(false)}
                      >
                        Cancelar
                      </MCButton>
                    </div>
                  </MCFormWrapper>
                </TabsContent>
              </div>
            </main>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MCSheetProfile;
