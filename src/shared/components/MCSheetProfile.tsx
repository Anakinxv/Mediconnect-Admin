import { Sheet, SheetContent, SheetClose } from "@/shared/ui/sheet";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import MCInput from "./forms/MCInput";
import { useState, useRef } from "react";
import MCFormWrapper from "./forms/MCFormWrapper";
import { profileSchema } from "@/schema/UserSchema";
import MCProfileImageUploader from "./MCProfileImageUploader";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";
import { useUpdateProfilePhoto } from "@/lib/hooks/useUpdateProfilePhoto";

interface MCSheetProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CropType = "banner" | "profile";

// Helper: converts a base64 data URL to a File object
function dataURLtoFile(dataUrl: string, filename: string): File {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new File([array], filename, { type: mime });
}

function MCSheetProfile({ open, onOpenChange }: MCSheetProfileProps) {
  const { t } = useTranslation("dashboard");
  const te = (key: string) => t(`userMenu.editProfile.${key}`);
  const isMobile = useIsMobile();

  const user = useAppStore((s) => s.user);
  const setProfilePicture = useAppStore((s) => s.setProfilePicture);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropType, setCropType] = useState<CropType>("profile");
  const [tempImage, setTempImage] = useState<string>("");

  const profileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updatePhoto, isPending: isUploadingPhoto } =
    useUpdateProfilePhoto();

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
    e.target.value = "";
  };

  const handleCropComplete = (croppedImage: string) => {
    if (cropType === "profile") {
      const file = dataURLtoFile(croppedImage, "profile-photo.jpg");
      updatePhoto(
        { file },
        {
          onSuccess: (data: any) => {
            const newUrl =
              data?.fotoPerfil ??
              data?.usuario?.fotoPerfil ??
              data?.data?.fotoPerfil ??
              croppedImage;

            setProfilePicture(newUrl);
          },
          onError: () => {
            // upload failed — no local state to revert, store is unchanged
          },
        },
      );
    } else {
    }
  };

  return (
    <>
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
                    onSubmit={() => {}}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-medium">
                        {te("profilePhoto")}
                      </h3>
                      <div className="flex items-center gap-4">
                        <label
                          className={`relative w-32 h-32 rounded-full overflow-hidden group ${
                            isUploadingPhoto
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer"
                          }`}
                        >
                          <Avatar className="w-32 h-32 rounded-full bg-muted border border-primary/10">
                            <AvatarImage
                              src={user!.profilePicture}
                              alt={user!.name ?? te("defaultName")}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          </Avatar>

                          <input
                            ref={profileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploadingPhoto}
                            onChange={(e) => handleImageChange(e, "profile")}
                          />

                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <span className="text-white font-semibold text-sm">
                              {isUploadingPhoto
                                ? te("uploading")
                                : te("changeImage")}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <MCInput
                      name="nombre"
                      label={te("fullName")}
                      type="text"
                      value={user!.name}
                      disabled
                      standalone
                    />

                    <MCInput
                      name="email"
                      label="Email"
                      type="email"
                      value={user?.email ?? ""}
                      disabled
                      standalone
                    />

                    <MCInput
                      name="rol"
                      label={te("role")}
                      type="text"
                      value={"Admin"}
                      disabled
                      standalone
                    />
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
