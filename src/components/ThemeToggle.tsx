
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 focus:outline-none transition-all duration-300"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-black" />
      ) : (
        <Sun className="h-5 w-5 text-white" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
