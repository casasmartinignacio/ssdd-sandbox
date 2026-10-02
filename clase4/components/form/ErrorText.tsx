export function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p style={{ margin: 0, color: "#8a3b2c", fontSize: 14 }}>{message}</p>;
}
