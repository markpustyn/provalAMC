import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from '@react-email/components';
import * as React from 'react';

type Props = {
  clientName: string;
  dashboardUrl: string;
  activateUrl: string;
  supportEmail?: string;
};

const baseUrl = 'https://www.evaluacloud.tech';
const previewText =
  'Welcome to Evalu Cloud Vendor Portal. Activate your account and get your first order.';

export default function Email(): React.ReactElement {
  return (
    <Html>
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="mx-auto my-auto bg-white px-4 py-6 font-sans">
          <Preview>{previewText}</Preview>

          <Section className="mt-4">
            <Img
              src={`${baseUrl}/Evalu%20Cloud.jpg`}
              width="250"
              height="120"
              alt="Evalu Cloud"
              className="mx-auto my-0"
            />
          </Section>

          <Container className="mx-auto mt-6 w-full max-w-[600px] border border-[#eaeaea]">
            <Section className="px-2 py-8">
              <Heading className="m-0 text-center text-[26px] font-semibold text-black">
                Welcome to Evalu Cloud Vendor Portal
              </Heading>


              <Text className="mt-20 text-[18px] leading-[24px] text-black">
                Thanks for joining the Vendor Portal. Follow the steps below to activate your account and start accepting work.
              </Text>

              <ol className="ml-4 mt-4 list-decimal text-[16px] leading-[24px] text-black">
                <li>Login into your account with Email and Password</li>
                <li>Click on Profile Tab</li>
                <li>Upload Real Estate License, W-9 and E&O Insurance</li>
                <li>Select Service areas by county then select zip codes</li>
              </ol>

              <Section className="mt-20 text-center">
                <Button
                  href={`${baseUrl}`}
                  className="rounded-lg bg-[#2563eb] px-[18px] py-3 text-[14px] font-semibold text-white no-underline"
                >
                  Login In
                </Button>
              </Section>

              <Text className="mt-4 text-center text-[12px] leading-[20px] text-[#666]">
                Questions? Email{' '}
                <Link href={`mailto:support@evaluacloud.tech`} className="text-[#2563eb] no-underline">
                  support@evaluacloud.tech
                </Link>
                .
              </Text>

              <Hr className="mx-0 my-6 w-full border border-[#eaeaea] border-solid" />

              <Row className="text-center">
                <Column>
                  <Link href={`${baseUrl}/privacy`} className="text-[12px] text-[#666] underline">
                    Privacy
                  </Link>
                </Column>
                <Column>
                  <Link href={`${baseUrl}/terms`} className="text-[12px] text-[#666] underline">
                    Terms
                  </Link>
                </Column>
              </Row>

              <Text className="mt-6 text-center text-[12px] text-[#9ca3af]">
                © {new Date().getFullYear()} Evalu Cloud. All rights reserved.
              </Text>
            </Section>
          </Container>

          <Section className="mt-6 text-center">
            <Text className="text-[12px] text-[#9ca3af]">
              You can ignore this email if you did not request access.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
