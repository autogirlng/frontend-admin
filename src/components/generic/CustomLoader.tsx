// components/Loader.tsx
import React from "react";
import Image from "next/image";
import styles from "./Loader.module.css";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const CustomLoader: React.FC<LoaderProps> = ({
  size = "lg",
  className = "",
  showText = true,
}) => {
  const sizeClasses = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    xl: styles.sizeXl,
  };

  return (
    <div className={`${styles.loaderOverlay} ${className}`}>
      <div className={styles.logoContainer}>
        {/* Heartbeat animated logo */}
        <div className={`${sizeClasses[size]} ${styles.heartbeat}`}>
          <Image
            src="/images/muvment.png"
            alt="Loading..."
            fill
            className={styles.logoImage}
            priority
          />
        </div>

        {/* Optional loading text */}
        {showText && <p className={styles.loadingText}>Loading...</p>}
      </div>
    </div>
  );
};

export default CustomLoader;
