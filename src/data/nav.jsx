export default {
  base: {
    children: [
      "dashboard",
      "performancedocument",
      "accounts",
      "identities",
      "switch",
    ],
    id: "base",
  },
  dashboard: {
    icon: "home",
    id: "dashboard",
    title: "Dashboard",
    url: "/",
  },
  performancedocument: {
    icon: "briefcase",
    id: "performancedocument",
    title: "Documents",
    url: "/performance-document",
  },

  accounts: {
    icon: "server",
    id: "accounts",
    title: "Accounts",
    url: "/subscription-list",
  },

  identities: {
    icon: "users",
    id: "identities",
    title: "Identities",
    url: "/profile/identities",
  },
  switch: {
    icon: "shuffle",
    id: "switch",
    title: "Switch",
    url: "/switch",
  },

  //   others: {
  //     children: ['walk_through', 'knowledge_base', 'help'],
  //     id: 'docs',
  //     title: 'Documentation',
  //   },
  others: {
    children: ["walk_through"],
    id: "docs",
    title: "Documentation",
  },
  walk_through: {
    icon: "compass",
    id: "walk_through",
    title: "WalkThrough",
    url: "/walk-through",
  },
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
