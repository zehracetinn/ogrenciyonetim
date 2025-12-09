export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-white outline-none focus:ring-2 focus:ring-red-600 ${className}`}
      {...props}
    />
  );
}
