import { Link, useLocation } from "react-router-dom";
import { Heart, Home, Dumbbell, BarChart3, Timer } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/poses", icon: Dumbbell, label: "Poses" },
  { to: "/routine", icon: Timer, label: "Routine" },
  { to: "/progress", icon: BarChart3, label: "Progress" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl md:top-0 md:bottom-auto">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        {/* Logo - desktop only */}
        <Link to="/" className="hidden md:flex items-center gap-2">
          <span className="text-2xl">🧘</span>
          <span className="font-display text-xl font-semibold text-foreground">YogaFlow</span>
        </Link>

        {/* Nav Items */}
        <div className="flex w-full items-center justify-around md:w-auto md:gap-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1 md:flex-row md:gap-2 md:rounded-lg md:px-4 md:py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-5 w-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] md:text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
