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
        "color-stepper-card-theme1": "#23367C"
      },

      borderColor: {
        "color-theme1": "#FFFFFF",
        "color-modal-theme1": "#8DC63F",
        "color-theme2": "#14213d",
        "color-theme3": "#004e89",
        "color-theme4": "#e27396",
      },
      textColor: {
        "color-theme1": "#000000",
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
      pattern: /bg-gradient-card-(theme1|theme2|theme3|theme4)/,
    },
    {
      pattern: /bg-color-card-(theme1|theme2|theme3|theme4)/,
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
