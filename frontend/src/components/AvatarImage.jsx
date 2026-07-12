import { useState } from "react";

const buildFallbackAvatar = (name = "User") => {
  const safeName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${safeName}&background=222831&color=ffffff&bold=true`;
};

const AvatarImage = ({ src, alt, name, className = "", imgClassName = "" }) => {
  const [imageSrc, setImageSrc] = useState(src || buildFallbackAvatar(name || alt));

  return (
    <div className={className}>
      <img
        src={imageSrc}
        alt={alt || name || "User avatar"}
        className={imgClassName}
        onError={() => setImageSrc(buildFallbackAvatar(name || alt))}
      />
    </div>
  );
};

export default AvatarImage;
