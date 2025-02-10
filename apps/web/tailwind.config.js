export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        content: {
          DEFAULT: "rgb(var(--content))",
          foreground: "rgb(var(--content-foreground))",
        },
        "sub-text": "rgb(var(--sub-text))",
        success: "rgb(var(--success))",
        important: "rgb(var(--important))",
        caution: "rgb(var(--caution))",
        error: "rgb(var(--error))",
      },
    },
  },
  plugins: [],
};
