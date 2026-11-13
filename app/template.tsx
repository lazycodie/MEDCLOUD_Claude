/** Re-mounts on every navigation, so each route gets the page-enter transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
