export function Badge({ className = "", children }) {
  return (
    <span
      className={`px-3 py-1 text-sm rounded-full font-medium ${className}`}
    >
      {children}
    </span>
  );
}
