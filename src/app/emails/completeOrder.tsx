import React from "react";
import {
  Body, Column, Container, Head, Hr, Html, Img, Link, Preview,
  Row, Section, Tailwind, Text,
} from "@react-email/components";

export type ClientOrderCompleteEmailProps = {
  orderId: string;
  product: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  clientName?: string;
  mainProduct?: string;
  completedAt?: string; // ISO or formatted
  downloadUrl: string;  // direct report link
  dashboardUrl?: string; // portal login
  supportEmail?: string;
  supportPhone?: string;
};

const baseUrl = 'https://app.bluegridvaluations.com';

export default function ClientOrderCompleteEmail(props: ClientOrderCompleteEmailProps) {
  const {
    orderId,
    propertyAddress,
    propertyCity,
    propertyState,
    propertyZip,
    mainProduct,
    completedAt,
    downloadUrl,
    dashboardUrl = `${baseUrl}/client/complete`,
    supportEmail = "support@bluegridvaluations.com",
    supportPhone = "(555) 123-4567",
  } = props;

  const fullAddress = `${propertyAddress}, ${propertyCity}, ${propertyState} ${propertyZip}`;

  return (
    <Html>
      <Head />
      <Preview>{mainProduct!} is ready to download</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto w-full max-w-[820px] px-6 py-10">
            {/* Header */}
            <Section className="px-4">
              <Row className="items-center">
                <Column>
                    <Img
                    src={`${baseUrl}/blackLogo.png`}
                    width="250"
                    height="80"
                    alt="Blue Grid"
                    className="my-0 mb-10"
                    />
                </Column>
                <Column align="right">
                  <Text className="m-0 text-[14px] text-[#6b7280]">
                    Order {orderId}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Title */}
            <Section className="mt-6 px-2">
              <Text className="mb-4 text-[28px] font-bold text-[#111]">
                Your report is ready
              </Text>
            <Text className="mt-2 text-[18px] text-[#374151]">
            Hello, your property inspection report is now complete. You can download it using the link below or sign in to your client portal to view the full report.  
            For any questions, please contact us at <Link href="mailto:support@bluegridvaluations.com" className="text-[#0073FF] underline">support@bluegridvaluations.com</Link>.
            </Text>

            </Section>

            {/* Quick facts */}
            <Section className="mt-6 mx-2 rounded border border-[#e5e7eb] bg-[#f9fafb]">
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-3">
                  <Text className="m-0 text-[16px] text-[#6b7280]">Property</Text>
                  <Text className="m-0 text-[20px] text-[#111] font-semibold">{fullAddress}</Text>
                </Column>
              </Row>
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-3">
                  <Text className="m-0 text-[16px] text-[#6b7280]">Report</Text>
                  <Text className="m-0 text-[20px] text-[#111] font-semibold">{mainProduct} Inspection</Text>
                </Column>
              </Row>
              <Row>
                <Column className="px-6 py-3">
                  <Text className="m-0 text-[14px] text-[#6b7280]">Order ID</Text>
                  <Text className="m-0 text-[18px] text-[#111]">{orderId}</Text>
                </Column>
              </Row>
            </Section>

            {/* CTA buttons */}
            <Section className="mt-8">
              <Row>
                <Column align="center" className="my-2 block">
                  <Link
                    href={downloadUrl}
                    className="inline-block rounded bg-[#0ea5e9] px-8 py-4 text-[18px] font-semibold text-white no-underline"
                  >
                    Download report
                  </Link>
                </Column>
              </Row>
              <Row>
                <Column align="center" className="my-2 block">
                  <Link
                    href={dashboardUrl}
                    className="inline-block rounded border border-[#0ea5e9] px-8 py-4 text-[18px] font-semibold text-[#0ea5e9] no-underline"
                  >
                    View in portal
                  </Link>
                </Column>
              </Row>
            </Section>

            <Hr className="my-10 border-t border-[#eee]" />

            {/* Support */}
            <Section className="px-2">
              <Text className="m-0 text-[18px] font-bold text-[#111]">Contact</Text>
              <Text className="mt-3 text-[16px] leading-[1.9] text-[#374151]">
                Email{" "}
                <Link href={`mailto:${supportEmail}`} className="text-[#0073FF] underline">
                  {supportEmail}
                </Link>{" "}
                or call {supportPhone}.
              </Text>
            </Section>

            <Hr className="my-8 border-t border-[#eee]" />

            <Text className="m-0 text-center text-[12px] leading-[1.8] text-[#6b7280]">
              You are receiving this message as a Blue Grid client for order {orderId}.
            </Text>
            <Text className="mt-2 text-center text-[12px] text-[#6b7280]">
              Need help?{" "}
              <Link href={`${baseUrl}/support`} className="text-[#0073FF] underline">
                Visit support
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
