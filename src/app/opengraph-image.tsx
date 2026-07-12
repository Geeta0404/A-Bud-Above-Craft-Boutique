import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF6EE",
          color: "#3A2E22",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#3A4632",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path d="M12 21c0-5 3-7 3-11a3 3 0 0 0-6 0c0 4 3 6 3 11Z" fill="#FBF6EE" />
          </svg>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 28, marginTop: 16, color: "#7A6A57" }}>{SITE_TAGLINE}</div>
      </div>
    ),
    { ...size }
  );
}
