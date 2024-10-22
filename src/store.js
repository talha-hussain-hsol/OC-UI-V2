// store.js

// Initial state
const state = {
  items: [],
  user: null,
};

// Function to add an item
function addItem(item) {
  state.items.push(item);
}

// Function to remove an item
function removeItem(item) {
  state.items = state.items.filter((i) => i !== item);
}

// Function to set user
function setUser(user) {
  state.user = user;
}

// Function to get current state
function getState() {
  return state;
}

// Exporting the functions for use in other files
export default { addItem, removeItem, setUser, getState };
