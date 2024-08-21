import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "#/utils/utils";

export const Tab: React.FC<{ to: string; label: string; className?: string }> = ({
  to,
  label,
  className,
}) => (
  <Link to={to} className={cn(`px-4 py-2 text-gray-700 hover:bg-gray-200`, className)}>
    {label}
  </Link>
);
