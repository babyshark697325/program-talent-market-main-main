import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const BackToTop: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Button
        onClick={handleClick}
        className="rounded-full shadow-lg bg-primary text-primary-foreground hover:shadow-xl"
        size="icon"
        aria-label="Back to top"
        title="Back to top"
      >
        <ArrowUp size={18} />
      </Button>
    </div>
  );
};

export default BackToTop;
