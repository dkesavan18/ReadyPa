import { OrderSync } from "@/components/shared/OrderSync";

export default function HotelLayout({
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
