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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b1712",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderBottom: "3px solid #b9793a",
            borderLeft: "3px solid #f3eee3",
            borderRight: "3px solid #f3eee3",
            borderTop: "3px solid #f3eee3",
          }}
        />
      </div>
    ),
    size
  );
}
