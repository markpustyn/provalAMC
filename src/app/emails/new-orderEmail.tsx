import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Props = {
  orderId: string;
  product: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  requestedDueDate?: string;
  clientName?: string;
  payoutUSD?: number;
  acceptUrl?: string;
  notes?: string;
  logoUrl?: string;
  fee?: any;
  supportEmail?: string;
  supportPhone?: string;
  borrowerName?: string;
  borrowerEmail?: string;
  borrowerPhoneNumber?: string;
  lender?: string;
  lenderAddress?: string;
  lenderCity?: string;
  lenderZip?: string;
  loanNumber?: string;
};

const baseUrl = "https://www.evaluacloud.tech";

export default function VendorNewOrderEmail({
  orderId,
  product,
  propertyAddress,
  propertyCity,
  propertyState,
  propertyZip,
  requestedDueDate,
  clientName,
  payoutUSD,
  acceptUrl = `${baseUrl}/broker/dashboard`,
  notes,
  logoUrl = `${baseUrl}/blackLogo.png`,
  fee,
  supportEmail = "support@evaluacloud.tech",
  supportPhone = "(555) 123-4567",
  borrowerName,
  borrowerEmail,
  borrowerPhoneNumber,
  lender,
  lenderAddress,
  lenderCity,
  lenderZip,
  loanNumber,
}: Props) {
  const fullAddress = `${propertyAddress}, ${propertyCity}, ${propertyState} ${propertyZip}`;
  return (
    <Html>
      <Head />
      <Preview>
        You have a new assignment that is pending your acceptance. Please sign in to accept or decline.
      </Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          {/* Wider container and larger base spacing */}
          <Container className="mx-auto w-full max-w-[820px] px-6 py-10">
            {/* Header */}
            <Section className="px-2">
              <Row className="items-center">
                <Column>
                  <Img
                    src={logoUrl}
                    width="240"
                    height="96"
                    alt="Blue Grid"
                    className="my-0"
                  />
                </Column>
                <Column align="right">
                  <Text className="m-0 text-[34px] font-semibold leading-[1.2] text-[#111]">
                    New Inspection Order
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Callout */}
            <Section className="mt-8 px-2">
              <Text className="m-0 rounded border border-[#e5e7eb] bg-[#f8fafc] px-6 py-5 text-[18px] leading-[1.8] text-[#111]">
                You have a new assignment that is pending your acceptance. Other vendors may also have been notified. Please accept as soon as possible. Sign in to the portal to accept or decline.
              </Text>
            </Section>

            {/* Order info title */}
            <Section className="mt-12 px-2 mb-2">
              <Text className="m-0 text-center text-[26px] font-bold text-[#111]">
                Order Information
              </Text>
            </Section>

            {/* Order info card — larger type and padding */}
            <Section className="mx-2 rounded border border-[#e5e7eb] bg-white text-[#111]">
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-1.5">
                  <Text className="m-0 text-[20px] font-medium leading-[1.8]">
                    Address:
                    <span className="ml-2 font-normal text-[#374151]">{fullAddress}</span>
                  </Text>
                </Column>
              </Row>
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-1.5">
                  <Text className="m-0 text-[20px] font-medium leading-[1.8]">
                    Service:
                    <span className="ml-2 font-normal text-[#374151]">{product} Property Inspection</span>
                  </Text>
                </Column>
              </Row>
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-1.5">
                  <Text className="m-0 text-[20px] font-medium leading-[1.8]">
                    Due Date:
                    <span className="ml-2 font-normal text-[#374151]">
                      {requestedDueDate || "TBD"}
                    </span>
                  </Text>
                </Column>
              </Row>
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-1.5">
                  <Text className="m-0 text-[20px] font-medium leading-[1.8]">
                    Fee:
                    <span className="ml-2 font-normal text-[#374151]">
                      {typeof fee !== "undefined" ? `$${fee}` : typeof payoutUSD === "number" ? `$${payoutUSD}` : "TBD"}
                    </span>
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="px-6 py-1.5">
                  <Text className="m-0 text-[20px] font-medium leading-[1.8]">
                    Order ID:
                    <span className="ml-2 font-normal text-[#374151]">{orderId}</span>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Instructions — bigger card */}
            <Section className="mt-12 px-2">
              <Text className="m-0 text-[22px] font-semibold text-[#111]">Instructions</Text>
              <Text className="mt-4 rounded border border-[#e5e7eb] bg-[#f8fafc] px-6 py-6 text-[18px] leading-[1.9] text-[#111]">
                {notes || "No special instructions were provided."}
              </Text>
            </Section>

            {/* Contact block — larger type */}
            <Section className="mt-10 px-2">
              <Text className="m-0 text-[22px] font-semibold text-[#111]">Contact</Text>
              <Text className="mt-3 text-[18px] leading-[1.9] text-[#374151]">
                Support Email:{" "}
                <Link href={`mailto:${supportEmail}`} className="text-[#0073FF] underline">
                  {supportEmail}
                </Link>
                <br />
                Support Phone: <span className="text-[#111]">{supportPhone}</span>
              </Text>
            </Section>

            {/* Borrower info — expanded */}
            <Section className="mt-12 px-2">
              <Text className="m-0 text-[22px] font-semibold text-[#111]">Borrower Information</Text>
            </Section>
            <Section className="mx-2 rounded border border-[#e5e7eb] bg-white">
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-5" colSpan={4}>
                  <Text className="m-0 text-[14px] text-[#6b7280]">Name</Text>
                  <Text className="m-0 text-[18px] text-[#111]">{borrowerName || "—"}</Text>
                </Column>
                <Column className="px-6 py-5" colSpan={4}>
                  <Text className="m-0 text-[14px] text-[#6b7280]">Email</Text>
                  <Text className="m-0 text-[18px] text-[#111]">{borrowerEmail || "—"}</Text>
                </Column>
                <Column className="px-6 py-5" colSpan={4}>
                  <Text className="m-0 text-[14px] text-[#6b7280]">Phone Number</Text>
                  <Text className="m-0 text-[18px] text-[#111]">{borrowerPhoneNumber || "—"}</Text>
                </Column>
              </Row>
            </Section>

            {/* Client info — expanded */}
            <Section className="mt-12 px-2">
              <Text className="m-0 text-[22px] font-semibold text-[#111]">Client Information</Text>
            </Section>
            <Section className="mx-2 rounded border border-[#e5e7eb] bg-white">
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-5" colSpan={6}>
                  <Text className="m-0 text-[14px] text-[#6b7280]">Name</Text>
                  <Text className="m-0 text-[18px] text-[#111]">{lender || "—"}</Text>
                </Column>
                <Column className="px-6 py-5" colSpan={6}>
                  <Text className="m-0 text-[14px] text-[#6b7280]">Client Address</Text>
                  <Text className="m-0 text-[18px] text-[#111]">
                    {lenderAddress || "—"}
                    <br />
                    {(lenderCity && lenderZip) ? `${lenderCity}, ${lenderZip}` : "—"}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="px-6 py-5" colSpan={6}>
                  <Text className="m-0 text-[14px] text-[#6b7280]">Loan Number</Text>
                  <Text className="m-0 text-[18px] text-[#111]">{loanNumber || "—"}</Text>
                </Column>
                <Column className="px-6 py-5" colSpan={6}>
                  <Text className="m-0 text-[14px] text-[#6b7280]">Loan Purpose</Text>
                  <Text className="m-0 text-[18px] text-[#111]">N/A</Text>
                </Column>
              </Row>
            </Section>

            <Hr className="my-12 border-t border-[#eee]" />

            {/* CTA — bigger button */}
            <Section>
              <Row>
                <Column align="center" className="my-2 block">
                  <Link
                    href={acceptUrl}
                    className="inline-block rounded bg-[#0073FF] px-10 py-5 text-[20px] font-semibold text-white no-underline"
                  >
                    View or accept order
                  </Link>
                </Column>
              </Row>
            </Section>

            <Hr className="my-10 border-t border-[#eee]" />

            {/* Footer */}
            <Text className="m-0 text-center text-[14px] leading-[1.8] text-[#6b7280]">
              You received this message because you are an active vendor on Blue Grid
            </Text>
            <Text className="mt-4 text-center text-[14px] text-[#6b7280]">
              Need help?{" "}
              <Link href={`${baseUrl}/support`} className="text-[#0073FF] underline">
                Contact support
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
