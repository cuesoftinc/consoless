// SkipLink: first focusable on every route; visually hidden until keyboard
// focus; the pill appearing on :focus IS the focus indication. Utility
// names only, no product-specific tokens.
import React from "react";

const SkipLink: React.FC = () => (
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:block focus:rounded-md focus:border focus:border-border-strong focus:bg-bg-raised focus:px-4 focus:py-2 focus:text-label-md focus:text-text-primary"
  >
    Skip to content
  </a>
);

export default SkipLink;
