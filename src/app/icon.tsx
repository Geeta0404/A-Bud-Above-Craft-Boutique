import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#C97B4A",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21c0-5 3-7 3-11a3 3 0 0 0-6 0c0 4 3 6 3 11Z"
            fill="#FBF6EE"
          />
          <path d="M12 10c-3-2-5-1-6-3 2-2 5-2 6 1" fill="#FBF6EE" />
          <path d="M12 10c3-2 5-1 6-3-2-2-5-2-6 1" fill="#FBF6EE" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
