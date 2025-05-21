// Replace the entire Sidebar component with a version that returns null
// This effectively removes the sidebar from all pages while maintaining imports

export function Sidebar({ className = "", activeItem = "Dashboard" }) {
  // Return null instead of rendering the sidebar
  return null
}

// Add a default export that also returns null
export default Sidebar
