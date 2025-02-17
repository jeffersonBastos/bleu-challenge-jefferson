import React from "react";

interface FeedbackOverlayProps {
  message: string;
  type: "success" | "error";
}

export default function FeedbackOverlay({
  message,
  type,
}: FeedbackOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo semi-transparente */}
      <div className="absolute inset-0 bg-black opacity-80"></div>
      {/* Container da mensagem */}
      <div
        className={`relative rounded-lg border-l-4 p-6 shadow-xl bg-white max-w-sm w-full 
          ${
            type === "success"
              ? "bg-success/20 border-success"
              : "bg-error/20 border-error"
          }`}
      >
        <p
          className={`text-center font-bold ${
            type === "success" ? "text-success" : "text-error"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
