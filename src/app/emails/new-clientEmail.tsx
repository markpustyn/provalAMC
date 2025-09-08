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

const baseUrl = 'https://www.evaluacloud.tech';
const previewText =
  'Welcome to Evalu Cloud Client Portal. Sign in and place your first order.';

export default function ClientEmail(): React.ReactElement {
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
                Welcome to the Evalu Cloud Client Portal
                </Heading>

                <Text className="mt-4 text-[14px] leading-[24px] text-black">
                Thank you for creating an account with Evalu Cloud. We help you order property inspections quickly with consistent quality. In your client portal you can create new orders and track progress in real time.
                </Text>

                <ol className="ml-4 mt-4 list-decimal text-[14px] leading-[24px] text-black">
                <li>Follow the link below and select <strong>Client Login</strong></li>
                <li>Sign in with your email and password</li>
                <li>Click the button below to create your first order</li>
                <li>Track order progress in your dashboard</li>
                <li>Get updates and notifications when your order is complete</li>
                </ol>


              <Section className="mt-6 text-center">
                <Button
                  href={baseUrl}
                  className="rounded-lg bg-[#2563eb] px-[18px] py-3 text-[14px] font-semibold text-white no-underline"
                >
                  Login
                </Button>
              </Section>

              <Text className="mt-4 text-center text-[12px] leading-[20px] text-[#666]">
                Questions? Email{' '}
                <Link href="mailto:support@evaluacloud.tech" className="text-[#2563eb] no-underline">
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
