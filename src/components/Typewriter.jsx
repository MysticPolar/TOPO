import { useState, useEffect, useRef } from "react";
import { COLORS } from "../styles/tokens.js";

export function Typewriter({ text, speed = 22, active = true }) {
  const [len, setLen] = useState(active ? 0 : (text || "").length);
  const prevRef = useRef(text || "");

  useEffect(() => {
    if (!active) {
      setLen((text || "").length);
      return;
    }
    if ((text || "").length < prevRef.current.length) setLen(0);
    prevRef.current = text || "";
  }, [text, active]);

  useEffect(() => {
    if (!active) return;
    const target = (text || "").length;
    if (len >= target) return;
    const timer = setTimeout(() => setLen((p) => p + 1), speed);
    return () => clearTimeout(timer);
  }, [len, text, speed, active]);

  const isTyping = active && len < (text || "").length;

  return (
    <>
      {(text || "").slice(0, len)}
      {isTyping && <span className="owls-press-tw-cursor" />}
    </>
  );
}

export function TypewriterEmpathy({ line2, red, after, speed = 22, active = true }) {
  const full = (line2 || "") + (red || "") + (after || "");
  const [len, setLen] = useState(active ? 0 : full.length);
  const prevRef = useRef(full);

  useEffect(() => {
    if (!active) {
      setLen(full.length);
      return;
    }
    if (full.length < prevRef.current.length) setLen(0);
    prevRef.current = full;
  }, [full, active]);

  useEffect(() => {
    if (!active) return;
    if (len >= full.length) return;
    const timer = setTimeout(() => setLen((p) => p + 1), speed);
    return () => clearTimeout(timer);
  }, [len, full, speed, active]);

  const l2Len = (line2 || "").length;
  const redEnd = l2Len + (red || "").length;
  const displayed = full.slice(0, len);
  const part1 = displayed.slice(0, Math.min(len, l2Len));
  const partRed = len > l2Len ? displayed.slice(l2Len, Math.min(len, redEnd)) : "";
  const part3 = len > redEnd ? displayed.slice(redEnd) : "";
  const isTyping = active && len < full.length;

  return (
    <>
      {part1}
      {partRed && <span style={{ color: COLORS.red }}>{partRed}</span>}
      {part3}
      {isTyping && <span className="owls-press-tw-cursor" />}
    </>
  );
}
