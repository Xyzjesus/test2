import { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Whitelist from "./Whitelist";
import Header from "./Header";
import "./index.css";

export default function App() {
  const mainDomain = "https://seitters.xyz/";

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef}>
      <Header
        mainDomain={mainDomain}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/whitelist" element={<Whitelist />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
