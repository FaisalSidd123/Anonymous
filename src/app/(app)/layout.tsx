import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Anonymous messaging platform",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
