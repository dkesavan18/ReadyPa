import { OrderSync } from "@/components/shared/OrderSync";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrderSync />
      {children}
    </>
  );
}
