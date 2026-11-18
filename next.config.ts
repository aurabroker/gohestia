import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Strony kalkulatora są generowane statycznie, a Next osadza w ich HTML
// skrypty inline (dane RSC i start hydracji). Nonce wymagałby renderowania
// każdej strony na żądanie przez proxy, dlatego script-src zostaje przy
// 'unsafe-inline'. 'unsafe-eval' tylko w `next dev` (wymaga go React).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "frame-src https://challenges.cloudflare.com",
  "connect-src 'self' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy",   value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;
