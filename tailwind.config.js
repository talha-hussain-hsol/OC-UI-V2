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
      keyframes: {
        zoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        zoom: 'zoom 0.5s infinite alternate',
      },
      backgroundImage: {
        "gradient-card-SC":
          "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
        "gradient-card-Ascent":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "gradient-profile-card-SC":
          "linear-gradient(to bottom, #243279 0%, #0091BB 100%)",
        "gradient-profile-card-Ascent":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "gradient-stepper-card-SC":
          "linear-gradient(to right, #243279 0%, #0091BB 100%)",
        "gradient-stepper-card-Ascent":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
        "color-cardheader-stepper-SC":
          "linear-gradient(to bottom, #24357C 0%, #0B76A8 100%)",
        "color-card-Ascent":
          "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)", // Card header in stepper ex: Face Snap

        "color-Ascent": "linear-gradient(to right, #0c2138 0%, #113c4d 100%)",
        "color-modal-SC":
          "linear-gradient(to bottom, #243279 0%, #0055BB 100%)",
           "color-card-header-Ascent": "linear-gradient(to bottom, #0e335b 0%, #161f3d 100%)",
           "color-account-SC":   "linear-gradient(to right, #243279 0%, #0091BB 100%)",
           "color-documents-Ascent":  "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
           "color-stepstatus-Ascent":  "linear-gradient(to bottom, #0d345d 0%, #151c39 100%)",
      },
      backgroundColor: {
        "theme-SC": "#edf2f4", // Color for Theme 1 (SC)
        "theme-lightTheme": "#efefd0", // Color for Theme 3 (lightTheme)
        "theme-Ascent": "#0c2138",
        "color-SC": "#edf2f4",
        "color-lightTheme": "#efefd0",
        "color-card-SC": "#FFFFFF",
        "color-card-lightTheme": "#dde5b6",
        "color-card-header-SC": "#ffffff",
        "color-SC-hover": "#ef233c",
        "color-lightTheme-hover": "#004e89",
        "color-Ascent-hover": "#e27396",
        "color-textfield-dropdown-SC": "#F7F7F7",
        "color-textfield-dropdown-Ascent": "#043f63",
        "color-textfield-SC": "transparent",
        "color-textfield-lightTheme": "#004e89",
        "color-textfield-Ascent": "#043f63",
        "color-modal-button-SC": "#6e84a3",
        "color-modal-button-Ascent": "#6e84a3",
        "color-button-SC": "#3DA500", // For All Buttons + Processing Case
        "color-button-Ascent": "#2bb02a", // For All Buttons + Processing Case
        "color-button1-SC": "#8DC63F", //For Accepted Case
        "color-button2-SC": "#F74036", // For Rejected Case
        "color-stepper-SC": "#8DC63F", // For Done State Stepper
        "color-stepper1-SC": "#2C75E6", // For Active State Stepper
        "color-stepper2-SC": "#A1AEBE", // For Inactive State Stepper
        "color-barchart-SC": "#0D7EF9",
        "color-barchart1-SC": "#68D930",
        "color-stepper-proceedbutton-SC": "#F0082E",
        "color-stepper-proceedbutton-Ascent": "#F0082E",
        "color-stepstatus-SC": "#24357C", // For Summary Page -> Status
        "sidebar-color-SC": "#FFFFFF",
        "color-stepper-card-SC": "#23367C",
        "color-table-color-SC": "#FAFAFB",
        "color-table-color-Ascent": "#12273f",
        "color-sidebar-SC": "#FFFFFF",
        "color-sidebar-Ascent": "#152e4d",
        "color-profile-icon-SC": "#F6F6F6",
        "color-profile-icon-Ascent": "#244166",
        "color-header-SC": "#FFFFFF",
        "color-header-Ascent": "#01214a",
        "color-table-header-Ascent": "#030c32",
        "color-table-header-SC": "#",
        "color-table-bg-Ascent": "#030c32",
        "color-table-bg-SC": "#FAFAFB",
        "color-search-Ascent": "#1e3a5c",
        "color-search-SC": "#FAFAFB",
        "color-tab-buttons-inactive-SC": "#F5F5F5",
        "color-tab-buttons-inactive-Ascent": "#0d3e80",
        "color-sidebar-nav-SC": "#243279", // Sidebar color for small screens
        "color-sidebar-nav-Ascent": "#152e4d", // Sidebar color for small screens
        "color-sidebar-nav-lightTheme": "", // Sidebar color for small screens
        
        // "color-modal-SC": "#FFFFFF",
        "color-modal-Ascent": "#152e4d",
        "color-modal-lightTheme": "",
        "color-iconButton-SC": "#ffffff",
        "color-iconButton-Ascent": "#152e4d",
        "color-iconButton-hover-SC": "#F6F6F6",
        "color-iconButton-hover-Ascent": "#12273F",
        "color-button2-Ascent": '#152e4d',
        "color-button3-Ascent": '#2c7be5',
        "color-button3-SC": '#3DA500',
         "color-button3-hover-Ascent": '#2569c3',
        "color-button3-hover-SC": '#348a01',
        "color-button4-hover-SC": '#348a01',
        "color-button4-hover-Ascent": '#00b86b',
        "color-button4-SC": '#3DA500',
        "color-button4-Ascent": '#2c7be5',
        "color-stepper-button-hover-SC": '#348a01',
        "color-stepper-button-hover-Ascent": '#00b86b',
        "color-stepper-button-SC": '#3DA500',
        "color-stepper-button-Ascent": '#3DA500',
       
        "color-account-Ascent": 'rgba(0, 0, 0, 0)',
        "color-documents-SC": 'rgba(0, 0, 0, 0)',
      },

      borderColor: {
        "color-SC": "#e0e0e0",
        "color-modal-SC": "#FFFFFF",
        "color-modal-Ascent": "#053d60",
        "color-lightTheme": "#004e89",
        "color-Ascent": "#1b3050",
        "color-dropdown-Ascent": "#06d3de",
        "color-button-SC": "",
        "color-button-Ascent": "#FFFFFF",
        "color-loader-SC": "#3DA500",
        "color-loader-Ascent": "#ffffff",
        "color-tooltip-SC": "#000000",
        "color-tooltip-Ascent": "#ffffff",
        "color-iconButton-hover-Ascent": "#1e3a5c",
        "color-iconButton-hover-SC": "#C4C4C4",
        "color-iconButton-Ascent": "#ffffff",
        "color-iconButton-SC": "#e0e0e0",
        "color-documents-SC": "#ffffff",
        "color-documents-Ascent": "rgba(0, 0, 0, 0)",
       
      },
      textColor: {
        "color-SC": "#3DA500",
        "color-para-SC": "#FFFFFF", //Identities screen para text color
        "color-para-Ascent": "#e79f31",  //Identities screen para text color
        "color-text-SC": "#000000",
        "color-text-Ascent": "#FFFFFF",
        "color-lightTheme": "#004e89",
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
        "color-icon-SC": "#3DA500",
        "color-icon-Ascent": "#ed9b0a",
        "color-modal-SC": "#000000",
        "color-modal-Ascent": "#FFFFFF",
        "color-description-SC": '#b7b9bd',
        "color-description-Ascent": '#536b8c',
        "color-fundName-SC": '#3DA500',
        "color-fundName-Ascent": '#ffffff',
        "color-fundStatus-SC": '#000000',
        "color-fundStatus-Ascent": '#ffffff',
       "color-activeTitle-Ascent": '#ffffff',
       "color-activeTitle-SC": '#3DA500',
      },
      fontFamily: {
        SC: ['"Roboto"', "sans-serif"], // Theme 1
        lightTheme: ['"Courier New"', "monospace"], // Theme 3
        Ascent: ['"Arial"', "sans-serif"], // Theme 4
      },
      fontSize: {
        SC: "16px", // Font size for theme 1
        lightTheme: "20px", // Font size for theme 3
        Ascent: "22px", // Font size for theme 4
      },
      boxShadow: {
        SC: "none",
        lightTheme: "1px 10px 24px rgba(0, 0, 0, 0.9)",
        Ascent: "1px 10px 24px rgba(0, 0, 0, 0.9)",
      },
      screens: {
        "2xs": "0px",
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
      pattern: /text-color-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-para-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-text-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-gradient-stepper-card-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-table-color-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-header-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-icon-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-stepper-proceedbutton-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-sidebar-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-documents-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-header-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-modal-button-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-search-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-sidebar-nav-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-tab-buttons-inactive-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-profile-icon-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-modal-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-gradient-profile-card-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-stepper-card-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /shadow-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-header-fund-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-h1-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-modal-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-icon-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-fundStatus-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-fundStatus-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-activeTitle-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-sidebar-icon-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-description-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-profile-icon-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-fundName-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /text-color-sidebar-icon-hover-(SC|lightTheme|Ascent)/,
      variants: ["hover"],
    },
    {
      pattern: /bg-color-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-button2-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-card-header-(SC|lightTheme|Ascent)/,
    },
    {
      
      pattern: /bg-color-table-header-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-account-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-table-bg-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-barchart-(SC|lightTheme|Ascent)/, // Background color for bar chart theme 1
    },
    {
      pattern: /bg-color-barchart1-(SC|lightTheme|Ascent)/,
    },

    {
      pattern: /bg-color-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-button3-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-gradient-card-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-card-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-textfield-dropdown-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-stepstatus-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-textfield-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-(SC|lightTheme|Ascent)/,
      variants: ["hover"],
    },
    {
      pattern: /bg-color-button3-hover-(SC|lightTheme|Ascent)/,
      variants: ["hover"],
    },
    {
      pattern: /bg-color-button-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-button1-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-button4-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /bg-color-stepper-button-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /border-color-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /border-color-dropdown-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /border-color-button-(SC|lightTheme|Ascent)/,
    },
    {
      pattern: /border-color-modal-(SC|lightTheme|Ascent)/, // Hover border color
    },
    {
      pattern: /border-color-loader-(SC|lightTheme|Ascent)/, // Hover border color
    },
    {
      pattern: /border-color-tooltip-(SC|lightTheme|Ascent)/, // Hover border color
    },
    {
      pattern: /border-color-documents-(SC|lightTheme|Ascent)/, // Hover border color
    },
    {
      pattern: /bg-color-iconButton-(SC|lightTheme|Ascent)/, // iconButtons in Accounts
     
    },
    {
      pattern: /border-color-(SC|lightTheme|Ascent)/, // Hover border color
      variants: ["hover"],
    },
    {
      pattern: /bg-color-button4-hover-(SC|lightTheme|Ascent)/, // Hover border color
      variants: ["hover"],
    },
    {
      pattern: /bg-color-stepper-button-hover-(SC|lightTheme|Ascent)/, // Hover border color
      variants: ["hover"],
    },
    {
      pattern: /text-color-(SC|lightTheme|Ascent)/, // Hover text color
      variants: ["hover"],
    },
    {
      pattern: /bg-color-iconButton-hover-(SC|lightTheme|Ascent)/, // Hover iconButtons in Accounts
      variants: ["hover"],
    },
    {
      pattern: /border-color-iconButton-(SC|lightTheme|Ascent)/, // Hover text color
    },
    {
      pattern: /border-color-iconButton-hover-(SC|lightTheme|Ascent)/, // Hover text color
      variants: ["hover"],
    },
    {
      pattern: /font-(SC|lightTheme|Ascent)/, // Font family for each theme
    },
  ],
  plugins: [require("tailwindcss-animate")],
};
