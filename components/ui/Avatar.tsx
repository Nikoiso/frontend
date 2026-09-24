interface AvatarProps {
    src?: string;
    alt?: string;
    size?: "sm" | "md" | "lg";
  }
  
  export default function Avatar({
    src,
    alt = "User",
    size = "md",
  }: AvatarProps) {
    const sizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-20 w-20",
    };
  
    return (
      <div
        className={`${sizes[size]} shrink-0 overflow-hidden rounded-full bg-gray-200`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            ?
          </div>
        )}
      </div>
    );
  }