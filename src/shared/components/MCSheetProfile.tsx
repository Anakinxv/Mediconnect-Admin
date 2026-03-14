import { Sheet, SheetContent, SheetClose } from "@/shared/ui/sheet";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import MCButton from "./forms/MCButton";
import MCInput from "./forms/MCInput";
import { useState, useRef } from "react";
import MCFormWrapper from "./forms/MCFormWrapper";
import { profileSchema } from "@/schema/UserSchema";
import MCProfileImageUploader from "./MCProfileImageUploader";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/MCUserAvatar";
import { useTranslation } from "react-i18next";

interface MCSheetProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CropType = "banner" | "profile";

function MCSheetProfile({ open, onOpenChange }: MCSheetProfileProps) {
  const { t } = useTranslation("dashboard");
  const te = (key: string) => t(`userMenu.editProfile.${key}`);
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    profilePicture: "",
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
  });

  const [banner, setBanner] = useState<string>(
    "https://i.pinimg.com/736x/3b/37/46/3b3746e0878804293202d56d1dda1fe1.jpg",
  );

  // Estados para crop modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropType, setCropType] = useState<CropType>("profile");
  const [tempImage, setTempImage] = useState<string>("");

  // Refs para inputs file
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // FIX 1: Solo lee el archivo y abre el modal — el label ya dispara el input por si solo
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: CropType,
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
    // Limpia el input para permitir reseleccionar la misma imagen
    e.target.value = "";
  };

  // FIX 2: Usa cropType para saber a qué estado guardar la imagen recortada
  const handleCropComplete = (croppedImage: string) => {
    if (cropType === "profile") {
      setFormData((prev) => ({ ...prev, profilePicture: croppedImage }));
    } else {
      setBanner(croppedImage);
    }
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
        title={cropType === "banner" ? te("cropBanner") : te("cropProfile")}
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
              : "w-[50vw] border-accent inset-y-0 my-2.5 flex items-center justify-center h-[calc(100%-20px)] rounded-l-4xl"
          }
        >
          <Tabs className="grid grid-cols-[35%_65%] h-full w-full">
            <aside
              className="w-full h-full rounded-l-4xl bg-accent/30 border-r-3 border-accent py-6 m-0 flex flex-col gap-4"
              role="navigation"
              aria-label="Opciones de edición de perfil"
            >
              <div className="w-full px-10 mt-6 flex flex-col gap-2">
                <h1 id="mc-sheet-title" className="text-xl font-medium">
                  {te("title")}
                </h1>
                <p id="mc-sheet-desc" className="text-base max-w-50 text-left">
                  {te("subtitle")}
                </p>
              </div>
              <TabsList
                className="flex flex-col gap-2 w-full justify-center items-center px-6 h-fit"
                role="tablist"
                aria-label="Secciones de perfil"
              >
                <TabsTrigger
                  value="info"
                  role="tab"
                  aria-controls="info-panel"
                  className="text-md rounded-full"
                >
                  <div className="flex items-center gap-2 p-2 rounded-full">
                    <span className="text-base font-medium">
                      {te("professionalInfo")}
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </aside>

            <main className="w-full h-full overflow-y-auto">
              <div className="flex items-center justify-end px-4 py-2">
                <SheetClose asChild>
                  <button
                    className="rounded-full h-8 w-8 flex items-center border-none outline-none ring-none justify-center hover:bg-accent/70 focus:bg-accent active:scale-95 transition-all duration-200"
                    aria-label={te("close")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </SheetClose>
              </div>

              <div className="flex items-center border-b-2 border-border mx-4">
                <h2 className="text-2xl font-medium px-5">
                  {te("generalInfo")}
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
                    schema={profileSchema(t)}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    {/* Foto de perfil */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-medium">
                        {te("profilePhoto")}
                      </h3>
                      <div className="flex items-center gap-4">
                        {/*
                          FIX 3: Eliminado el onClick del label.
                          El <label> ya dispara el <input type="file"> que contiene adentro
                          de forma nativa — agregar onClick causaba que el file picker
                          se abra dos veces y la segunda cancelación bloqueaba la selección.
                        */}
                        <label className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group">
                          <Avatar className="w-32 h-32 rounded-full bg-muted border border-primary/10">
                            {formData.profilePicture ? (
                              <AvatarImage
                                src={formData.profilePicture}
                                alt={formData.nombre || te("defaultName")}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted rounded-full">
                                <MCUserAvatar
                                  name={formData.nombre || te("defaultName")}
                                  square={false}
                                  size={128}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </Avatar>

                          {/* Input oculto — el label lo activa automáticamente */}
                          <input
                            ref={profileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, "profile")}
                          />

                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <span className="text-white font-semibold text-sm">
                              {te("changeImage")}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Nombre Completo */}
                    <MCInput
                      name="nombre"
                      label={te("fullName")}
                      type="text"
                      placeholder={te("namePlaceholder")}
                      value={formData.nombre}
                      onChange={(e) =>
                        handleInputChange("nombre", e.target.value)
                      }
                    />

                    {/* Email solo lectura */}
                    <MCInput
                      name="email"
                      label="Email"
                      type="email"
                      placeholder={te("emailPlaceholder")}
                      value={formData.email}
                      disabled
                    />

                    {/* Botones de acción */}
                    <div className="flex gap-3 mt-4">
                      <MCButton
                        variant="primary"
                        size="m"
                        onClick={handleSubmit}
                      >
                        {te("saveChanges")}
                      </MCButton>
                      <MCButton
                        variant="secondary"
                        size="m"
                        onClick={() => onOpenChange(false)}
                      >
                        {te("cancel")}
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
