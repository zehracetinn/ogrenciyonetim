import React from "react";

const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    // "className" propunu buraya eklemezsek, AdminLogin'de yazdığın hiçbir şey çalışmaz!
    className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };