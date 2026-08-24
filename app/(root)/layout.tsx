import { ReactNode } from "react";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
