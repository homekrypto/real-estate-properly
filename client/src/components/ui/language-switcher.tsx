import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export function LanguageSwitcher({ currentLanguage = "en", onLanguageChange }: LanguageSwitcherProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  
  const currentLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange?.(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.name}</span>
          <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {selectedLanguage === language.code && (
              <span className="ml-auto text-forest-600 dark:text-forest-400">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
