export default {
  base: {
    children: [
      "domains",
      "customers",
      "identities",
      "settings",
      "ageing_report",
      "consumption_report",
    ],
    id: "base",
  },
  dashboard: {
    icon: "home",
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
  },

  domains: {
    icon: "grid",
    id: "domains",
    title: "Domains",
    url: "/domains",
  },
  customers: {
    icon: "users",
    id: "customers",
    title: "Customers",
    url: "/customers/list",
  },
  identities: {
    icon: "shuffle",
    id: "switch",
    title: "Switch",
    url: "/switch",
  },
  settings: {
    icon: "settings",
    id: "settings",
    title: "Settings",
    url: "",
  },
  ageing_report: {
    icon: "download",
    id: "ageing_report",
    title: "Ageing Report",
    url: "",
  },
  consumption_report: {
    icon: "download",
    id: "consumption_report",
    title: "Consumption Report",
    url: "",
  },

  //   others: {
  //     children: ['walk_through', 'knowledge_base', 'help'],
  //     id: 'docs',
  //     title: 'Documentation',
  //   },
  // others: {
  //   children: ["walk_through", "knowledge_base", "help"],
  //   id: "docs",
  //   title: "Documentation",
  // },
  // walk_through: {
  //   icon: 'compass',
  //   id: 'walk_through',
  //   title: 'WalkThrough',
  //   url: '/walk-through',
  // },
  // knowledge_base: {
  //   icon: 'book-open',
  //   id: 'knowledge_base',
  //   title: 'Knowledge Base',
  //   url: '/knowledge-base',
  // },
  // help: {
  //   icon: 'help-circle',
  //   id: 'help',
  //   title: 'Help',
  //   url: '/help',
  // },
};
