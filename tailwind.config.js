// /**  @type {import('tailwindcss').Config} */
// module.exports = {
//   // darkMode: ["class"],
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./pages/**/*.{js,jsx}",
//     "./components/**/*.{js,jsx}",
//     "./app/**/*.{js,jsx}",
//     "./src/**/*.{js,jsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       backgroundImage: {
//         "custom-gradient":
//           "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
//         "gradient-card-theme1":
//           "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
//         "gradient-card-theme4":
//           "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
//       },
//       backgroundColor: {
//         "color-theme1": "#F5F5F5",
//         "color-theme2": "#e5e5e5",
//         "color-theme3": "#efefd0",
//         // "color-theme4": "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
//         "color-card-theme1": "#FFFFFF",
//         "color-card-theme2": "#ededed",
//         "color-card-theme3": "#dde5b6",
//         // "color-card-theme4": "#b5e2fa",
//         "color-theme1-hover": "#ef233c",
//         "color-theme2-hover": "#14213d",
//         "color-theme3-hover": "#004e89",
//         "color-theme4-hover": "#e27396",
//         "color-textfield-theme1": "#FFFFFF",
//         "color-textfield-theme2": "#14213d",
//         "color-textfield-theme3": "#004e89",
//         "color-textfield-theme4": "#043f63",
//         "color-dropdown-theme1": "#77838F",
//         "color-button-theme1": "#2C75E6", // For All Buttons + Processing Case
//         "color-button-theme4": "#2C75E6", // For All Buttons + Processing Case
//         "color-button1-theme1": "#8DC63F", //For Accepted Case
//         "color-button2-theme1": "#F74036", // For Rejected Case
//         "color-button3-theme1": "#F2A428", // For Pending Case
//         "color-button4-theme1": "#EE381F", // For On Hold Case
//         "color-stepper-theme1": "#8DC63F", // For Done State Stepper
//         "color-stepper1-theme1": "#2C75E6", // For Active State Stepper
//         "color-stepper2-theme1": "#A1AEBE", // For Inactive State Stepper
//         "color-barchart-theme1": "#0D7EF9",
//         "color-barchart1-theme1": "#68D930",
//         "color-cardheader-stepper-theme1":
//           "linear-gradient(to bottom, #24357C 0%, #0B76A8 100%)", // Card header in stepper ex: Face Snap
//         "color-stepper-card-theme1":
//           "linear-gradient(to right, #243279 0%, #0091BB 100%)",
//         "color-stepper-proceedbutton-theme1": "#F0082E",
//         "color-stepstatus-theme1": "#24357C", // For Summary Page -> Status
//         "sidebar-color-theme1": "#FFFFFF",
//       },

//       borderColor: {
//         "color-theme1": "#ef233c",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         "color-theme4": "#e27396",
//       },
//       textColor: {
//         "color-theme1": "#000000",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         // "color-theme4": "#e27396",
//         "color-theme4": "#FFFFFF",
//         "color-h1-theme1": "#1A203D",
//         "color-h1-theme4": "#FFFFFF",
//         "color-h3-theme1": "#2C75E6",
//         "color-header-theme1": "#FFFFFF",
//         "color-header-theme4": "#e79f31",
//         "color-header-fund-theme1": "#FFFFFF",
//         "color-header-fund-theme4": "#FFFFFF",
//         "color-status-theme1": "#2e77e7",
//         "color-status-theme4": "#05b56f",
//       },
//       fontFamily: {
//         theme1: ['"Roboto"', "sans-serif"], // Replace "Roboto" with the desired font
//         theme2: ['"Merriweather"', "serif"], // Replace "Merriweather" with the desired font
//         theme3: ['"Courier New"', "monospace"], // Replace "Courier New" with the desired font
//         theme4: ['"Arial"', "sans-serif"], // Replace "Arial" with the desired font
//       },
//       fontSize: {
//         theme1: "16px", // Font size for theme 1
//         theme2: "18px", // Font size for theme 2
//         theme3: "20px", // Font size for theme 3
//         theme4: "22px", // Font size for theme 4
//       },
//       screens: {
//         xs: "350px",
//         // => @media (min-width: 350px) { ... }

//         sm: "640px",
//         // => @media (min-width: 640px) { ... }

//         md: "768px",
//         // => @media (min-width: 768px) { ... }

//         lg: "1024px",
//         // => @media (min-width: 1024px) { ... }

//         xl: "1280px",
//         // => @media (min-width: 1280px) { ... }

//         "2xl": "1536px",
//         // => @media (min-width: 1536px) { ... }
//       },
//     },
//     corePlugins: {
//       preflight: false,
//     },
//   },

//   safelist: [
//     {
//       pattern: /text-color-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /text-color-header-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /text-color-header-fund-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /text-color-h1-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /text-color-status-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /bg-color-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /bg-gradient-card-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /bg-color-card-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /bg-color-textfield-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /hover:bg-color-(theme1|theme2|theme3|theme4)/, // Hover background
//     },
//     {
//       pattern: /bg-color-button-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /border-color-(theme1|theme2|theme3|theme4)/, // Hover border color
//     },
//     {
//       pattern: /hover:border-color-(theme1|theme2|theme3|theme4)/, // Hover border color
//     },
//     {
//       pattern: /hover:text-color-(theme1|theme2|theme3|theme4)/, // Hover text color
//     },
//     {
//       pattern: /font-(theme1|theme2|theme3|theme4)/, // Font family for each theme
//     },
//     {
//       pattern: /text-size-(theme1|theme2|theme3|theme4)/, // Font size for each theme
//     },
//   ],
//   plugins: [require("tailwindcss-animate")],
// };

// /**  @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: ["class"],
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./pages/**/*.{js,jsx}",
//     "./components/**/*.{js,jsx}",
//     "./app/**/*.{js,jsx}",
//     "./src/**/*.{js,jsx}",
//   ],

//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     screens: {
//       xs: "350px",
//       // => @media (min-width: 350px) { ... }

//       sm: "640px",
//       // => @media (min-width: 640px) { ... }

//       md: "768px",
//       // => @media (min-width: 768px) { ... }

//       lg: "1024px",
//       // => @media (min-width: 1024px) { ... }

//       xl: "1280px",
//       // => @media (min-width: 1280px) { ... }

//       "2xl": "1536px",
//       // => @media (min-width: 1536px) { ... }
//     },
//     extend: {
//       backgroundImage: {
//         "custom-gradient":
//           "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
//         "gradient-card-theme1":
//           "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
//       },
//       backgroundColor: {
//         "color-theme1": "#edf2f4",
//         "color-theme2": "#e5e5e5",
//         "color-theme3": "#efefd0",
//         "color-theme4": "#004e89",
//         "color-card-theme1": "#FFFFFF",
//         "color-card-theme2": "#ededed",
//         "color-card-theme3": "#dde5b6",
//         "color-card-theme4": "#b5e2fa",
//         "color-theme1-hover": "#ef233c",
//         "color-theme2-hover": "#14213d",
//         "color-theme3-hover": "#004e89",
//         "color-theme4-hover": "#e27396",
//         "color-dropdown-theme1": "#77838F",
//         "color-button-theme1": "#2C75E6", // For All Buttons + Processing Case
//         "color-button1-theme1": "#8DC63F", //For Accepted Case
//         "color-button2-theme1": "#F74036", // For Rejected Case
//         "color-button3-theme1": "#F2A428", // For Pending Case
//         "color-button4-theme1": "#EE381F", // For On Hold Case
//         "color-stepper-theme1": "#8DC63F", // For Done State Stepper
//         "color-stepper1-theme1": "#2C75E6", // For Active State Stepper
//         "color-stepper2-theme1": "#A1AEBE", // For Inactive State Stepper
//         "color-barchart-theme1": "#0D7EF9",
//         "color-barchart1-theme1": "#68D930",
//         "color-cardheader-stepper-theme1":
//           "linear-gradient(to bottom, #24357C 0%, #0B76A8 100%)", // Card header in stepper ex: Face Snap
//         "color-stepper-card-theme1":
//           "linear-gradient(to right, #243279 0%, #0091BB 100%)",
//         "color-stepper-proceedbutton-theme1": "#F0082E",
//         "color-stepstatus-theme1": "#24357C", // For Summary Page -> Status
//         "sidebar-color-theme1": "#FFFFFF",
//         "gradient-card-theme1":
//           "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
//         // "gradient-card-theme2": "linear-gradient(to bottom, #ededed, #14213d)",
//         // "gradient-card-theme3": "linear-gradient(to bottom, #dde5b6, #004e89)",
//         // "gradient-card-theme4": "linear-gradient(to bottom, #b5e2fa, #e27396)",
//       },

//       borderColor: {
//         "color-theme1": "#ef233c",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         "color-theme4": "#e27396",
//       },
//       textColor: {
//         "color-theme1": "#000000",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         "color-theme4": "#e27396",
//         "color-h1-theme1": "#1A203D",
//         "color-h3-theme1": "#2C75E6",
//       },
//       fontFamily: {
//         theme1: ['"Roboto"', "sans-serif"], // Replace "Roboto" with the desired font
//         theme2: ['"Merriweather"', "serif"], // Replace "Merriweather" with the desired font
//         theme3: ['"Courier New"', "monospace"], // Replace "Courier New" with the desired font
//         theme4: ['"Arial"', "sans-serif"], // Replace "Arial" with the desired font
//       },
//       fontSize: {
//         theme1: "16px", // Font size for theme 1
//         theme2: "18px", // Font size for theme 2
//         theme3: "20px", // Font size for theme 3
//         theme4: "22px", // Font size for theme 4
//       },
//       borderRadius: {
//         "15px": "15px",
//       },
//       backgroundImage: {
//         "custom-gradient":
//           "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
//       },
//       // fontFamily: {
//       //   theme1: ['"Roboto"', "sans-serif"], // Replace "Roboto" with the desired font
//       //   theme2: ['"Merriweather"', "serif"], // Replace "Merriweather" with the desired font
//       //   theme3: ['"Courier New"', "monospace"], // Replace "Courier New" with the desired font
//       //   theme4: ['"Arial"', "sans-serif"], // Replace "Arial" with the desired font
//       // },
//       // fontSize: {
//       //   theme1: "16px", // Font size for theme 1
//       //   theme2: "18px", // Font size for theme 2
//       //   theme3: "20px", // Font size for theme 3
//       //   theme4: "22px", // Font size for theme 4
//       // },
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
//     },
//     corePlugins: {
//       preflight: false,
//     },
//   },
//   safelist: [
//     {
//       pattern: /text-color-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /bg-color-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /bg-color-card-(theme1|theme2|theme3|theme4)/,
//     },
//     {
//       pattern: /hover:bg-color-(theme1|theme2|theme3|theme4)/, // Hover background
//     },
//     {
//       pattern: /hover:border-color-(theme1|theme2|theme3|theme4)/, // Hover border color
//     },
//     {
//       pattern: /hover:text-color-(theme1|theme2|theme3|theme4)/, // Hover text color
//     },
//     {
//       pattern: /font-(theme1|theme2|theme3|theme4)/, // Font family for each theme
//     },
//     {
//       pattern: /text-size-(theme1|theme2|theme3|theme4)/, // Font size for each theme
//     },
//   ],
//   plugins: [require("tailwindcss-animate")],
// };

// /**  @type {import('tailwindcss').Config} */
// module.exports = {
//   // content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
//   content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
// theme: {
//     screens: {
//       xs: "350px",
//       // => @media (min-width: 350px) { ... }

//       sm: "640px",
//       // => @media (min-width: 640px) { ... }

//       md: "768px",
//       // => @media (min-width: 768px) { ... }

//       lg: "1024px",
//       // => @media (min-width: 1024px) { ... }

//       xl: "1280px",
//       // => @media (min-width: 1280px) { ... }

//       "2xl": "1536px",
//       // => @media (min-width: 1536px) { ... }
//     },
//     extend: {
//       backgroundImage: {
//         "custom-gradient":
//           "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
//         "gradient-card-theme1":
//           "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
//       },
//       backgroundColor: {
//         "color-theme1": "#edf2f4",
//         "color-theme2": "#e5e5e5",
//         "color-theme3": "#efefd0",
//         "color-theme4": "#004e89",
//         "color-card-theme1": "#FFFFFF",
//         "color-card-theme2": "#ededed9",
//         "color-card-theme3": "#dde5b6",
//         "color-card-theme4": "#b5e2fa",
//         "color-theme1-hover": "#ef233c",
//         "color-theme2-hover": "#14213d",
//         "color-theme3-hover": "#004e89",
//         "color-theme4-hover": "#e27396",
//         "color-dropdown-theme1": "#77838F",
//         "color-dropdown-theme2": "#e5e5e5",
//         "color-dropdown-theme3": "#efefd0",
//         "color-dropdown-theme4": "#004e89",
//         "color-button-theme1": "#2C75E6", // For All Buttons + Processing Case
//         "color-button1-theme1": "#8DC63F", //For Accepted Case
//         "color-button2-theme1": "#F74036", // For Rejected Case
//         "color-button3-theme1": "#F2A428", // For Pending Case
//         "color-button4-theme1": "#EE381F", // For On Hold Case
//         "color-stepper-theme1": "#8DC63F", // For Done State Stepper
//         "color-stepper1-theme1": "#2C75E6", // For Active State Stepper
//         "color-stepper2-theme1": "#A1AEBE", // For Inactive State Stepper
//         "color-barchart-theme1": "#0D7EF9",
//         "color-barchart1-theme1": "#68D930",
//         "color-cardheader-stepper-theme1": "linear-gradient(to bottom, #24357C 0%, #0B76A8 100%)", // Card header in stepper ex: Face Snap
//         "color-stepper-card-theme1": "linear-gradient(to right, #243279 0%, #0091BB 100%)",
//         "color-stepper-proceedbutton-theme1": "#F0082E",
//         "color-stepstatus-theme1": "#24357C", // For Summary Page -> Status
//         "sidebar-color-theme1": "#FFFFFF",
//         "gradient-card-theme1":
//           "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
//         // "gradient-card-theme2": "linear-gradient(to bottom, #ededed, #14213d)",
//         // "gradient-card-theme3": "linear-gradient(to bottom, #dde5b6, #004e89)",
//         // "gradient-card-theme4": "linear-gradient(to bottom, #b5e2fa, #e27396)",
//       },

//       borderColor: {
//         "color-theme1": "#ef233c",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         "color-theme4": "#e27396",
//       },
//       textColor: {
//         "color-theme1": "#000000",
//         "color-theme2": "#14213d",
//         "color-theme3": "#004e89",
//         "color-theme4": "#e27396",
//         "color-h1-theme1": "#1A203D",
//         "color-h3-theme1": "#2C75E6"
//       },
//       fontFamily: {
//         theme1: ['"Roboto"', "sans-serif"], // Replace "Roboto" with the desired font
//         theme2: ['"Merriweather"', "serif"], // Replace "Merriweather" with the desired font
//         theme3: ['"Courier New"', "monospace"], // Replace "Courier New" with the desired font
//         theme4: ['"Arial"', "sans-serif"], // Replace "Arial" with the desired font
//       },
//       fontSize: {
//         theme1: "16px", // Font size for theme 1
//         theme2: "18px", // Font size for theme 2
//         theme3: "20px", // Font size for theme 3
//         theme4: "22px", // Font size for theme 4
//       },
//     },
//     safelist: [
//       {
//         pattern: /text-color-(theme1|theme2|theme3|theme4)/, // Text color for each theme
//       },
//       {
//         pattern: /bg-color-(theme1|theme2|theme3|theme4)/, // Background color for each theme
//       },
//       {
//         pattern: /bg-color-card-(theme1|theme2|theme3|theme4)/, // Background color for card themes
//       },
//       {
//         pattern: /hover:bg-color-(theme1|theme2|theme3|theme4)/, // Hover background color for each theme
//       },
//       {
//         pattern: /hover:border-color-(theme1|theme2|theme3|theme4)/, // Hover border color for each theme
//       },
//       {
//         pattern: /hover:text-color-(theme1|theme2|theme3|theme4)/, // Hover text color for each theme
//       },
//       {
//         pattern: /font-(theme1|theme2|theme3|theme4)/, // Font family for each theme
//       },
//       {
//         pattern: /text-(theme1|theme2|theme3|theme4)/, // Font size for each theme
//       },
//       {
//         pattern: /bg-gradient-card-theme1/, // Background gradient for card theme1
//       },
//       {
//         pattern: /bg-gradient-card-theme2/, // Background gradient for card theme2 (commented out in config)
//       },
//       {
//         pattern: /bg-gradient-card-theme3/, // Background gradient for card theme3 (commented out in config)
//       },
//       {
//         pattern: /bg-gradient-card-theme4/, // Background gradient for card theme4 (commented out in config)
//       },
//       {
//         pattern: /bg-color-stepper-(theme1|theme2|theme3|theme4)/, // Background color for stepper theme states
//       },
//       {
//         pattern: /bg-color-button-(theme1|theme2|theme3|theme4)/, // Background color for buttons
//       },
//     ],

//     plugins: [],
//   },
// };

/**  @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "gradient-card-theme1":
          "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
        "gradient-card-theme4":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "gradient-stepper-card-theme1":
          "linear-gradient(to right, #243279 0%, #0091BB 100%)",
        "color-cardheader-stepper-theme1":
          "linear-gradient(to bottom, #24357C 0%, #0B76A8 100%)", // Card header in stepper ex: Face Snap
      },
      backgroundColor: {
        "color-theme1": "#edf2f4",
        "color-theme2": "#e5e5e5",
        "color-theme3": "#efefd0",
        // "color-theme4": "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "color-card-theme1": "#FFFFFF",
        "color-card-theme2": "#ededed",
        "color-card-theme3": "#dde5b6",
        // "color-card-theme4": "#b5e2fa",
        "color-theme1-hover": "#ef233c",
        "color-theme2-hover": "#14213d",
        "color-theme3-hover": "#004e89",
        "color-theme4-hover": "#e27396",
        "color-textfield-theme1": "transparent",
        "color-textfield-theme2": "#14213d",
        "color-textfield-theme3": "#004e89",
        "color-textfield-theme4": "#043f63",
        "color-dropdown-theme1": "#77838F",
        "color-button-theme1": "#3DA500", // For All Buttons + Processing Case
        "color-button-theme4": "#2C75E6", // For All Buttons + Processing Case
        "color-button1-theme1": "#8DC63F", //For Accepted Case
        "color-button2-theme1": "#F74036", // For Rejected Case
        "color-button3-theme1": "#F2A428", // For Pending Case
        "color-button4-theme1": "#EE381F", // For On Hold Case
        "color-stepper-theme1": "#8DC63F", // For Done State Stepper
        "color-stepper1-theme1": "#2C75E6", // For Active State Stepper
        "color-stepper2-theme1": "#A1AEBE", // For Inactive State Stepper
        "color-barchart-theme1": "#0D7EF9",
        "color-barchart1-theme1": "#68D930",
        "color-stepper-proceedbutton-theme1": "#F0082E",
        "color-stepstatus-theme1": "#24357C", // For Summary Page -> Status
        "sidebar-color-theme1": "#FFFFFF",
        "color-stepper-card-theme1": "#23367C",
      },

      borderColor: {
        "color-theme1": "#FFFFFF",
        "color-modal-theme1": "#8DC63F",
        "color-theme2": "#14213d",
        "color-theme3": "#004e89",
        "color-theme4": "#e27396",
      },
      textColor: {
        "color-theme1": "#3DA500",
        "color-para-theme1": "#000000",
        "color-para-theme4": "#e79f31",
        "color-theme2": "#14213d",
        "color-theme3": "#004e89",
        // "color-theme4": "#e27396",
        "color-theme4": "#FFFFFF",
        "color-h1-theme1": "#1A203D",
        "color-h1-theme4": "#FFFFFF",
        "color-h3-theme1": "#2C75E6",
        "color-header-theme1": "#FFFFFF",
        "color-header-theme4": "#e79f31",
        "color-header-fund-theme1": "#FFFFFF",
        "color-header-fund-theme4": "#FFFFFF",
        "color-status-theme1": "#2e77e7",
        "color-status-theme4": "#05b56f",
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
    },
    corePlugins: {
      preflight: false,
    },
  },

  safelist: [
    {
      pattern: /text-color-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /text-color-para-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-gradient-stepper-card-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /text-color-header-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-stepper-proceedbutton-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-stepper-card-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /text-color-header-fund-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /text-color-h1-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /text-color-status-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-barchart-(theme1|theme2|theme3|theme4)/, // Background color for bar chart theme 1
    },
    {
      pattern: /bg-color-barchart1-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-dropdown-(theme1|theme2|theme3|theme4)/, // Background color for dropdowns
    },
    {
      pattern: /bg-color-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-gradient-card-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-card-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-stepstatus-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-textfield-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /hover:bg-color-(theme1|theme2|theme3|theme4)/, // Hover background
    },
    {
      pattern: /bg-color-button-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /border-color-(theme1|theme2|theme3|theme4)/, // Hover border color
    },
    {
      pattern: /border-color-modal-(theme1|theme2|theme3|theme4)/, // Hover border color
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
  plugins: [require("tailwindcss-animate")],
};
