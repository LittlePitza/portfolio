import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same monogram as icon.svg, rasterised for iOS home screens. */
export default function AppleIcon() {
  const bar = (style: React.CSSProperties) => <div style={{ position: "absolute", background: "#141414", ...style }} />;
  const u = 180 / 64;
  return new ImageResponse(
    (
      <div style={{ width: 180, height: 180, background: "#ff4a1c", position: "relative", display: "flex" }}>
        {bar({ left: 9 * u, top: 11 * u, width: 9 * u, height: 42 * u })}
        {bar({ left: 9 * u, top: 44 * u, width: 21 * u, height: 9 * u })}
        {bar({ left: 34 * u, top: 11 * u, width: 9 * u, height: 42 * u })}
        {bar({ left: 49 * u, top: 11 * u, width: 9 * u, height: 42 * u })}
        {bar({ left: 34 * u, top: 28 * u, width: 24 * u, height: 8 * u })}
        {bar({ left: 60 * u, top: 0, width: 4 * u, height: 180 })}
      </div>
    ),
    size,
  );
}
