"use client";

interface TweetImageProps {
  images: string[];
}

export default function TweetImage({ images }: TweetImageProps) {
  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
        <img
          src={images[0]}
          alt="Tweet image"
          className="max-h-[500px] w-full object-cover"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-2xl">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Tweet image ${index + 1}`}
            className="h-[300px] w-full object-cover"
          />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-2xl">
        <img
          src={images[0]}
          alt="Tweet image 1"
          className="row-span-2 h-[400px] w-full object-cover"
        />

        <img
          src={images[1]}
          alt="Tweet image 2"
          className="h-[198px] w-full object-cover"
        />

        <img
          src={images[2]}
          alt="Tweet image 3"
          className="h-[198px] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-2xl">
      {images.slice(0, 4).map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image}
            alt={`Tweet image ${index + 1}`}
            className="h-[250px] w-full object-cover"
          />

          {index === 3 && images.length > 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-2xl font-bold text-white">
                +{images.length - 4}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}