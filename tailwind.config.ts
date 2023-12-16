function withOpacity(variableName: string) {
  return ({ opacityValue }: { opacityValue: string | undefined }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        tree: {
          DEFAULT: "var(--tree)",
          foreground: "var(--tree-foreground)",
        },
        treeSelected: {
          DEFAULT: "var(--tree-selected)",
          foreground: "var(--tree-selected-foreground)",
        },
        treeHover: {
          DEFAULT: "var(--tree-hover)",
          foreground: "var(--tree-hover-foreground)",
        },
        treeButton: {
          DEFAULT: "var(--tree-button)",
          foreground: "var(--tree-button-foreground)",
        },
        treeButtonParentHover: {
          DEFAULT: "var(--tree-button-hover-parent)",
          foreground: "var(--tree-button-hover-parent-foreground)",
        },
        treeButtonHover: {
          DEFAULT: "var(--tree-button-hover)",
          foreground: "var(--tree-button-hover-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // shadow: {
      //   "popup-menu": "shadow-[0_10px_20px_rgba(0,_0,_0,_0.7)]",
      // },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
