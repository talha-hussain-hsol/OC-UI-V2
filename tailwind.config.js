// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: ["class"],
//   content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
//   prefix: "",
//   theme: {

//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     padding: {
//       "0.5p": "0.125rem", // 0.5% of the default spacing scale
//       "7p": "7%", // 7% padding-left
//       "4p": "4%", // 4% padding-right
//     },
//     extend: {
//       backgroundColor: {
//         'color-theme1': '#edf2f4',
//         'color-theme2': '#e5e5e5',
//         'color-theme3': '#efefd0',
//         'color-theme4': '#004e89',
//         'color-card-theme1': '#8d99ae',
//         'color-card-theme2': '#ededed9',
//         'color-card-theme3': '#dde5b6',
//         'color-card-theme4': '#b5e2fa',
//         'color-theme1-hover': '#ef233c',
//         'color-theme2-hover': '#14213d',
//         'color-theme3-hover': '#004e89',
//         'color-theme4-hover': '#e27396',
//       },

//       borderColor: {
//         "color-theme1": "#ef233c",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         "color-theme4": "#e27396",
//       },
//       textColor: {
//         "color-theme1": "#ef233c",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         "color-theme4": "#e27396",
//       },

//       borderRadius: {
//         "15px": "15px",
//       },
//       backgroundImage: {
//         "custom-gradient":
//           "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
//       },
//       // backgroundImage: {
//       //   "custom-gradient": "linear-gradient(129deg, rgb(12, 30, 54) 0%, rgb(24, 100, 109) 500vh)",
//       // },
//       fontFamily: {
//         theme1: ['"Roboto"', 'sans-serif'], // Replace "Roboto" with the desired font
//         theme2: ['"Merriweather"', 'serif'], // Replace "Merriweather" with the desired font
//         theme3: ['"Courier New"', 'monospace'], // Replace "Courier New" with the desired font
//         theme4: ['"Arial"', 'sans-serif'], // Replace "Arial" with the desired font
//       },
//       fontSize: {
//         theme1: '16px', // Font size for theme 1
//         theme2: '18px', // Font size for theme 2
//         theme3: '20px', // Font size for theme 3
//         theme4: '22px', // Font size for theme 4
//       },
//       colors: {
//         darkprimary: "#152E4D",
//         accordin: "#12263F",
//         dimgray: "#696363",
//         lightsteelblue: {
//           100: "#b2c8d5",
//           200: "#aec5d4",
//         },
//         crimson: "#ff333d",
//         mediumseagreen: "#4cb656",
//         gainsboro: {
//           100: "#e6e6e6",
//           200: "rgba(230, 230, 230, 0.09)",
//         },
//         aliceblue: "#d4e7f0",
//         forestgreen: "#43b34a",
//         "gray-gray-500": "#718096",
//         "gray-gray-200": "#e2e8f0",
//         "gray-gray-400": "#a0aec0",
//         lightslategray: "#929eae",
//         whitesmoke: "#f7f7f7",
//         warning: "#856404",
//         warningBar: "#fff3cd",
//         customBlue: "#003553",
//         darkturquoise: "#29c6db",
//         lightTurquoise: "#29c6db47",
//         lightgray: "#d4d2d2",
//         darkcyan: "#0094a8",
//         white: "#fff",
//         darkslategray: {
//           100: "#3f3c3c",
//           200: "#2e2e2e",
//           300: "#003553",
//         },
//         steelblue: "#0b5074",
//         darkorange: "#ff8701",
//         "gray-2": "#2c2c2e",
//         black: "#000",
//         red: "#E30D17",
//         green: "#4CB656",
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         success: {
//           DEFAULT: "#008000",
//           foreground: "#fff",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//         animation: "spin 1s linear infinite",

//         // @keyframes spin {
//         //   from {
//         //     transform: rotate(0deg);
//         //   }
//         //   to {
//         //     transform: rotate(360deg);
//         //   }
//         // }
//       },
//       fontSize: {
//         lg: "18px",
//         "61xl": "80px",
//         "21xl": "40px",
//         "5xl": "24px",
//         inherit: "inherit",
//       },
//       screens: {
//         'xs': '350px',
//         // => @media (min-width: 350px) { ... }

//         'sm': '640px',
//         // => @media (min-width: 640px) { ... }

//         'md': '768px',
//         // => @media (min-width: 768px) { ... }

//         'lg': '1024px',
//         // => @media (min-width: 1024px) { ... }

//         'xl': '1280px',
//         // => @media (min-width: 1280px) { ... }

//         '2xl': '1536px',
//         // => @media (min-width: 1536px) { ... }
//         lg: {
//           max: "1200px",
//         },
//         mq1350: {
//           raw: "screen and (max-width: 1350px)",
//         },
//         mq1125: {
//           raw: "screen and (max-width: 1125px)",
//         },
//         mq1050: {
//           raw: "screen and (max-width: 1050px)",
//         },
//         mq975: {
//           raw: "screen and (max-width: 975px)",
//         },
//         mq920: {
//           raw: "screen and (max-width: 920px)",
//         },
//         mq800: {
//           raw: "screen and (max-width: 800px)",
//         },
//         mq750: {
//           raw: "screen and (max-width: 750px)",
//         },
//         mq700: {
//           raw: "screen and (max-width: 700px)",
//         },
//         mq450: {
//           raw: "screen and (max-width: 450px)",
//         },
//       },
//     },
//     corePlugins: {
//       preflight: false,
//     },
//   },

// safelist: [
//   {
//     pattern: /text-color-(theme1|theme2|theme3|theme4)/,
//   },
//   {
//     pattern: /bg-color-(theme1|theme2|theme3|theme4)/,
//   },
//   {
//     pattern: /bg-color-card-(theme1|theme2|theme3|theme4)/,
//   },
//   {
//     pattern: /hover:bg-color-(theme1|theme2|theme3|theme4)/, // Hover background
//   },
//   {
//     pattern: /hover:border-color-(theme1|theme2|theme3|theme4)/, // Hover border color
//   },
//   {
//     pattern: /hover:text-color-(theme1|theme2|theme3|theme4)/, // Hover text color
//   },
//   {
//     pattern: /font-(theme1|theme2|theme3|theme4)/, // Font family for each theme
//   },
//   {
//     pattern: /text-size-(theme1|theme2|theme3|theme4)/, // Font size for each theme
//   },
// ],
//   plugins: [require("tailwindcss-animate")],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
theme: {
    screens: {
      xs: "350px",
      // => @media (min-width: 350px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "gradient-card-theme1":
          "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
      },
      backgroundColor: {
        "color-theme1": "#edf2f4",
        "color-theme2": "#e5e5e5",
        "color-theme3": "#efefd0",
        "color-theme4": "#004e89",
        "color-card-theme1": "#8d99ae",
        "color-card-theme2": "#ededed9",
        "color-card-theme3": "#dde5b6",
        "color-card-theme4": "#b5e2fa",
        "color-theme1-hover": "#ef233c",
        "color-theme2-hover": "#14213d",
        "color-theme3-hover": "#004e89",
        "color-theme4-hover": "#e27396",
        "sidebar-color-theme1": "#FFFFFF",
        "gradient-card-theme1":
          "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
        // "gradient-card-theme2": "linear-gradient(to bottom, #ededed, #14213d)",
        // "gradient-card-theme3": "linear-gradient(to bottom, #dde5b6, #004e89)",
        // "gradient-card-theme4": "linear-gradient(to bottom, #b5e2fa, #e27396)",
      },

      borderColor: {
        "color-theme1": "#ef233c",
        "color-theme2": "#14213d",
        "color-theme3": "#004e89",
        "color-theme4": "#e27396",
      },
      textColor: {
        "color-theme1": "#ef233c",
        "color-theme2": "#14213d",
        "color-theme3": "#004e89",
        "color-theme4": "#e27396",
      },
      fontFamily: {
        theme1: ['"Roboto"', "sans-serif"], // Replace "Roboto" with the desired font
        theme2: ['"Merriweather"', "serif"], // Replace "Merriweather" with the desired font
        theme3: ['"Courier New"', "monospace"], // Replace "Courier New" with the desired font
        theme4: ['"Arial"', "sans-serif"], // Replace "Arial" with the desired font
      },
      fontSize: {
        theme1: "16px", // Font size for theme 1
        theme2: "18px", // Font size for theme 2
        theme3: "20px", // Font size for theme 3
        theme4: "22px", // Font size for theme 4
      },
    },
    safelist: [
      {
        pattern: /text-color-(theme1|theme2|theme3|theme4)/,
      },
      {
        pattern: /bg-color-(theme1|theme2|theme3|theme4)/,
      },
      {
        pattern: /bg-color-card-(theme1|theme2|theme3|theme4)/,
      },
      {
        pattern: /hover:bg-color-(theme1|theme2|theme3|theme4)/, // Hover background
      },
      {
        pattern: /hover:border-color-(theme1|theme2|theme3|theme4)/, // Hover border color
      },
      {
        pattern: /hover:text-color-(theme1|theme2|theme3|theme4)/, // Hover text color
      },
      {
        pattern: /font-(theme1|theme2|theme3|theme4)/, // Font family for each theme
      },
      {
        pattern: /text-size-(theme1|theme2|theme3|theme4)/, // Font size for each theme
      },
    ],
    plugins: [],
  },
};
