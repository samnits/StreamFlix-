import { useEffect, useMemo, useState } from "react";

const getInitials = (name = "User") => {
  const normalized = (name || "User").trim();
  if (!normalized) return "U";

  return normalized
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";
};

const AvatarImage = ({ src, alt, name, className = "", imgClassName = "" }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const initials = useMemo(() => getInitials(name || alt), [name, alt]);

  if (!src || imageFailed) {
    return (
      <div className={`${className} bg-primary/20 text-primary flex items-center justify-center font-bold uppercase overflow-hidden`}>
        <span className="select-none">{initials}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt || name || "User avatar"}
        className={imgClassName}
        onError={() => setImageFailed(true)}
      />
    </div>
  );
};

export default AvatarImage;
