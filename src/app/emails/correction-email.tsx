import React from "react";
import {
  Body, Column, Container, Head, Hr, Html, Img, Preview,
  Row, Section, Tailwind, Text,
} from "@react-email/components";

export type CorrectionsNeededEmailProps = {
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  comments: string;
  logoUrl?: string;
  supportEmail?: string;
};

const baseUrl = "https://app.bluegridvaluations.com";

export default function CorrectionsNeededEmail({
  propertyAddress,
  propertyCity,
  propertyState,
  propertyZip,
  comments,
  logoUrl = `${baseUrl}/blackLogo.png`,
  supportEmail = "support@bluegridvaluations.com",
}: CorrectionsNeededEmailProps) {
  const fullAddress = `${propertyAddress}, ${propertyCity}, ${propertyState} ${propertyZip}`;

  return (
    <Html>
      <Head />
      <Preview>Corrections needed for {fullAddress}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto w-full max-w-[700px] px-6 py-10">
            <Section className="px-2 mb-6">
              <Row className="items-center">
                <Column>
                  <Img
                    src={logoUrl}
                    width="250"
                    height="100"
                    alt="Blue Grid"
                    className="my-0"
                  />
                </Column>
              </Row>
            </Section>

            <Section className="px-2">
              <Text className="text-[28px] font-bold text-[#111] mb-4">
                Corrections Needed
              </Text>
              <Text className="text-[18px] leading-[1.7] text-[#374151]">
                Please review all comments below and make corrections <strong>as soon as possible</strong>.
              </Text>
            </Section>

            <Section className="mt-8 px-2 rounded border border-[#e5e7eb] bg-[#f8fafc]">
              <Row className="border-b border-[#e5e7eb]">
                <Column className="px-6 py-4">
                  <Text className="m-0 text-[18px] text-[#111]">
                    <strong>Property Address:</strong>
                  </Text>
                  <Text className="m-0 text-[18px] text-[#374151] mt-1">
                    {fullAddress}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column className="px-6 py-4">
                  <Text className="m-0 text-[18px] text-[#111] mb-1">
                    <strong>Correction Notes:</strong>
                  </Text>
                  <Text className="m-0 text-[18px] text-[#374151] leading-[1.7] whitespace-pre-line">
                    {comments || "No comments provided."}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="my-10 border-t border-[#eee]" />

            <Text className="text-[14px] text-[#6b7280] text-center">
              You received this message because you are assigned to this order on Blue Grid.
            </Text>
            <Text className="text-[14px] text-[#6b7280] text-center mt-3">
              For questions, email{" "}
              <a href={`mailto:${supportEmail}`} className="text-[#0073FF] underline">
                {supportEmail}
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
