export function Dialog({ children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1f1f1f] border border-zinc-700 p-6 rounded-xl">
        {children}
      </div>
    </div>
  );
}
