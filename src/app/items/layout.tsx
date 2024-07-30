export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="deskTop:px-[360px]">{children}</div>;
}
