
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Palette, Droplet } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 focus:outline-none transition-all duration-300 glass-bg border-white/20 dark:border-white/10"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Droplet className="h-5 w-5 text-job-blue" />
      ) : (
        <Palette className="h-5 w-5 text-job-purple" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
