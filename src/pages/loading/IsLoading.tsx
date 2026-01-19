import React from "react";

interface IsLoadingProps {
  message?: string; // رسالة اختيارية
}

const IsLoading: React.FC<IsLoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div
      style={{
        
        // position: "fixed",      // يغطي الشاشة بالكامل
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center", // محاذاة أفقية
        alignItems: "center",     // محاذاة رأسية
        backgroundColor: "rgba(255, 255, 255, 0.8)", // نصف شفاف
        zIndex: 9999, // فوق كل العناصر
        flexDirection: "column",
      }}
    >
      {/* دائرة التحميل */}
      <div
        style={{
          border: "6px solid #f3f3f3",
          borderTop: "6px solid #3498db",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          animation: "spin 1s linear infinite",
          marginBottom: "16px",
        }}
      />
      <p style={{ fontSize: "1.2rem", color: "#333" , textTransform:"capitalize"}}>{message}</p>

      {/* CSS للـ spin animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default IsLoading;
