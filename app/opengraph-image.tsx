import { ImageResponse } from "next/og";

export const alt = "Clevorah";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F6F5F2",
          color: "#171717",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 96,
        }}
      >
        Clevorah
      </div>
    ),
    { ...size },
  );
}
