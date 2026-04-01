interface BlobImageProps {
  src: string;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

import type React from "react";

export default function BlobImage({
  src,
  alt = "",
  className = "",
  fallback,
}: BlobImageProps) {
  if (!src) return <>{fallback || null}</>;
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
