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
        "gradient-card-SC":
          "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
        "gradient-card-Ascent":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "gradient-stepper-card-SC":
          "linear-gradient(to right, #243279 0%, #0091BB 100%)",
        "color-cardheader-stepper-SC":
          "linear-gradient(to bottom, #24357C 0%, #0B76A8 100%)", // Card header in stepper ex: Face Snap
          "gradient-stepper-card-Ascent":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
      },
      backgroundColor: {
        "color-SC": "#edf2f4",
        "color-light": "#efefd0",
        // "color-Ascent": "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "color-card-SC": "#FFFFFF",
        "color-card-light": "#dde5b6",
        // "color-card-Ascent": "#b5e2fa",
        "color-card-header-SC": "#edf2f4",
        "color-SC-hover": "#ef233c",
        "color-light-hover": "#004e89",
        "color-Ascent-hover": "#e27396",
        "color-textfield-SC": "transparent",
        "color-textfield-dropdown-SC": "#F7F7F7",
        "color-textfield-light": "#004e89",
        "color-textfield-Ascent": "#043f63",
        "color-dropdown-SC": "#77838F",
        "color-button-SC": "#3DA500", // For All Buttons + Processing Case
        "color-button-Ascent": "#2C75E6", // For All Buttons + Processing Case
        "color-button1-SC": "#8DC63F", //For Accepted Case
        "color-button2-SC": "#F74036", // For Rejected Case
        "color-button3-SC": "#F2A428", // For Pending Case
        "color-button4-SC": "#EE381F", // For On Hold Case
        "color-stepper-SC": "#8DC63F", // For Done State Stepper
        "color-stepper1-SC": "#2C75E6", // For Active State Stepper
        "color-stepper2-SC": "#A1AEBE", // For Inactive State Stepper
        "color-barchart-SC": "#0D7EF9",
        "color-barchart1-SC": "#68D930",
        "color-stepper-proceedbutton-SC": "#F0082E",
        "color-stepper-proceedbutton-Ascent": "rgb(230, 55, 87)",

        "color-stepstatus-SC": "#24357C", // For Summary Page -> Status
        "sidebar-color-SC": "#FFFFFF",
        "color-stepper-card-SC": "#23367C",
        "color-table-color-SC": "#FAFAFB",
        "color-sidebar-SC": "#FFFFFF",
        "color-sidebar-Ascent": "#152e4d",
        "color-profile-icon-SC": "#F6F6F6",
        "color-profile-icon-Ascent": "#244166",
      },

      borderColor: {
        "color-SC": "#e0e0e0",
        "color-modal-SC": "#8DC63F",
        "color-light": "#004e89",
        "color-Ascent": "#1b3050",
      },
      textColor: {
        "color-SC": "#3DA500",
        "color-para-SC": "#000000",
        "color-para-Ascent": "#e79f31",
        "color-text-SC": "#000000",
        "color-text-Ascent": "#FFFFFF",
        "color-light": "#004e89",
        // "color-Ascent": "#e27396",
        "color-Ascent": "#FFFFFF",
        "color-h1-SC": "#1A203D",
        "color-h1-Ascent": "#FFFFFF",
        "color-h3-SC": "#2C75E6",
        "color-header-SC": "#FFFFFF",
        "color-header-Ascent": "#e79f31",
        "color-header-fund-SC": "#FFFFFF",
        "color-header-fund-Ascent": "#FFFFFF",
        "color-status-SC": "#2e77e7",
        "color-status-Ascent": "#05b56f",
        "color-sidebar-icon-SC": "#5C5E64",
        "color-sidebar-icon-Ascent": "#6e84a3",
        "color-sidebar-icon-hover-SC": "#000000",
        "color-sidebar-icon-hover-Ascent": "#FFFFFF",
        "color-profile-icon-SC": "#5C5E64",
        "color-profile-icon-Ascent": "#FFFFFF",
      },
      fontFamily: {
        SC: ['"Roboto"', "sans-serif"], // Replace "Roboto" with the desired font
        light: ['"Courier New"', "monospace"], // Replace "Courier New" with the desired font
        Ascent: ['"Arial"', "sans-serif"], // Replace "Arial" with the desired font
      },
      fontSize: {
        SC: "16px", // Font size for theme 1
        light: "20px", // Font size for theme 3
        Ascent: "22px", // Font size for theme 4
      },
      boxShadow: {
        SC: "none",
        light: "1px 10px 24px rgba(0, 0, 0, 0.9)",
        Ascent: "1px 10px 24px rgba(0, 0, 0, 0.9)",
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
      pattern: /text-color-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-para-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-text-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-gradient-stepper-card-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-table-color-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-header-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-stepper-proceedbutton-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-sidebar-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-profile-icon-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-stepper-card-(SC|light|Ascent)/,
    },
    {
      pattern: /shadow-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-header-fund-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-h1-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-status-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-sidebar-icon-(SC|light|Ascent)/,
    },
    {
      pattern: /text-color-profile-icon-(SC|light|Ascent)/,
    },
    {
      pattern: /hover:text-color-sidebar-icon-hover-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-card-header-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-barchart-(SC|light|Ascent)/, // Background color for bar chart theme 1
    },
    {
      pattern: /bg-color-barchart1-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-dropdown-(SC|light|Ascent)/, // Background color for dropdowns
    },
    {
      pattern: /bg-color-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-gradient-card-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-card-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-textfield-dropdown-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-stepstatus-(SC|light|Ascent)/,
    },
    {
      pattern: /bg-color-textfield-(SC|light|Ascent)/,
    },
    {
      pattern: /hover:bg-color-(SC|light|Ascent)/, // Hover background
    },
    {
      pattern: /bg-color-button-(SC|light|Ascent)/,
    },
    {
      pattern: /border-color-(SC|light|Ascent)/, // Hover border color
    },
    {
      pattern: /border-color-modal-(SC|light|Ascent)/, // Hover border color
    },
    {
      pattern: /hover:border-color-(SC|light|Ascent)/, // Hover border color
    },
    {
      pattern: /hover:text-color-(SC|light|Ascent)/, // Hover text color
    },
    {
      pattern: /font-(SC|light|Ascent)/, // Font family for each theme
    },
    {
      pattern: /text-size-(SC|light|Ascent)/, // Font size for each theme
    },
  ],
  plugins: [require("tailwindcss-animate")],
};
