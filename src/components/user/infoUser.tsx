import Image from "next/image";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import imgMasc from "../../profile-masc.webp";
import imgFem from "../../profile-fem.webp";

export default function InfoUser() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };

  // Define the profile image based on gender
  const profileImage = session?.user?.gender === "Feminino" ? imgFem : imgMasc;

  return (
    <div className="flex gap-4 items-center">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className="mr-2"
      />
      <div className="flex justify-end items-start flex-col">
        <h1 className="text-gray-600 font-bold text-xl dark:text-white">
          {session?.user?.name}
        </h1>
        <h1 className="text-gray-600 font-bold text-xs dark:text-white">
          {session?.user?.email}
        </h1>
      </div>
      <Image
        src={profileImage}
        width={50}
        height={50}
        alt="Imagem de perfil"
        className="rounded-full"
      />
    </div>
  );
}
