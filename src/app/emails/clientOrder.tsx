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
import { House } from 'lucide-react';


const baseUrl = 'https://www.evaluacloud.tech';

type ClientOrderProps = {
  clientName: string;
  product: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  userCity: string;

  orderId: string;
  userEmail: string;
  userStreet: string;
  userZip: string;
  userState: string;
  fee: any;
  date: string; // ISO string
  requestedDueDate: any;
};

export default function ClientOrder({
  clientName,
  product,
  propertyAddress,
  propertyCity,
  propertyState,
  propertyZip,
  userCity,
  orderId,
  userEmail,
  userStreet,
  userZip,
  userState,
  date,
  requestedDueDate,
  fee,
}: ClientOrderProps) {
  return (
    <Html>
      <Head />
      <Preview>Your inspection order is confirmed {orderId}</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto w-full max-w-[660px] py-5">
            {/* Header */}
            <Section>
              <Row>
                <Column>
                    <Img
                    src={`${baseUrl}/blackLogo.png`}
                    width="200"
                    height="80"
                    alt="Blue Grid"
                    className="my-0 mb-10"
                    />
                </Column>
              </Row>
            </Section>
            {/* Info table */}
            <Section className="rounded bg-[#FAFAFA] text-[12px] text-[#333]">
              <Row className="min-h-[46px]">
                <Column colSpan={2}>
                  <Section>
                    <Row>
                      <Column className="min-h-[44px] border-0 border-white border-r border-b pl-5">
                        <Text className="m-0 p-0 text-[10px] leading-[1.4] text-[#666]">EMAIL</Text>
                        <Link
                          className="m-0 p-0 text-[12px] leading-[1.4] text-[#15c] underline"
                        >
                          {userEmail}
                        </Link>
                      </Column>
                    </Row>

                    <Row>
                      <Column className="min-h-[44px] border-0 border-white border-r border-b pl-5">
                        <Text className="m-0 p-0 text-[10px] leading-[1.4] text-[#666]">ORDER DATE</Text>
                        <Text className="m-0 p-0 text-[12px] leading-[1.4]">{date}</Text>
                      </Column>
                    </Row>

                    <Row>
                      <Column className="min-h-[44px] border-0 border-white border-r border-b pl-5">
                        <Text className="m-0 p-0 text-[10px] leading-[1.4] text-[#666]">ORDER ID</Text>
                        <Link className="m-0 p-0 text-[12px] leading-[1.4] text-[#15c] underline">
                          {orderId}
                        </Link>
                      </Column>
                    </Row>
                  </Section>
                </Column>

                <Column className="min-h-[44px] border-0 border-white border-r border-b pl-5" colSpan={2}>
                  <Text className="m-0 p-0 text-[10px] leading-[1.4] text-[#666]">BILLED TO</Text>
                  {/* <Text className="m-0 p-0 text-[12px] leading-[1.4]">Card</Text> */}
                  <Text className="m-0 p-0 text-[12px] leading-[1.4]">{clientName}</Text>
                  <Text className="m-0 p-0 text-[12px] leading-[1.4]">{userStreet}</Text>
                  <Text className="m-0 p-0 text-[12px] leading-[1.4]">{userCity}, {userState} {userZip}</Text>
                </Column>
              </Row>
            </Section>

            {/* Section title */}
            <Section className="my-[30px] min-h-[24px] rounded bg-[#FAFAFA] text-[12px]">
              <Text className="m-0 bg-[#FAFAFA] pl-2 text-[14px] font-medium">Order Summary</Text>
            </Section>

            {/* Line item */}
            <Section>
              <Row>
                <Column className="w-[64px]">
                  <Img
                    src={`${baseUrl}/house.png`}
                    width="64"
                    height="64"
                    alt="House"
                    className="ml-5 rounded-[14px] border border-[#F2F2F2]"
                  />
                </Column>

                <Column className="pl-[22px]">
                  <Text className="m-0 text-[12px] font-semibold">{propertyAddress} {propertyCity}, {propertyState} {propertyZip}</Text>
                  <Text className="m-0 text-[12px]">{product}</Text>
                  <Text className="m-0 text-[12px] text-[#666]">Submitted By: {requestedDueDate}</Text>
                  <Link href="mailto:support@evaluacloud.tech" className="text-[12px] text-[#0070C9] no-underline">
                    Contact Support
                  </Link>
                  <span className="mx-1 text-[#333] font-extralight">|</span>
                  <Link href="https://www.apple.com/" className="text-[12px] text-[#0070C9] no-underline">
                    Cancel Order
                  </Link>
                </Column>

                <Column align="right" className="table-cell w-[100px] pr-5 align-top">
                  <Text className="m-0 text-[12px] font-semibold">${fee}</Text>
                </Column>
              </Row>
              <Row className="mt-4">
                <Column className="pl-[22px]">
                  <Text className="m-0 text-[12px] font-semibold">Additional Requested Fee</Text>
                </Column>

                <Column align="right" className="table-cell w-[100px] pr-5 align-top">
                  <Text className="m-0 text-[12px] font-semibold">$0</Text>
                </Column>
              </Row>
            </Section>

            <Hr className="my-0 mt-[30px] border-t border-[#eee]" />

            {/* Total */}
            <Section align="right">
              <Row>
                <Column align="right" className="table-cell">
                  <Text className="m-0 pr-[30px] text-right text-[10px] font-semibold text-[#666]">TOTAL</Text>
                </Column>
                <Column className="min-h-[48px] border-l border-[#eee] pt-[48px]" />
                <Column className="table-cell w-[90px]">
                  <Text className="m-0 mr-5 whitespace-nowrap text-right text-[16px] font-semibold">${fee}</Text>
                </Column>
              </Row>
            </Section>

            <Hr className="mb-[75px] mt-0 border-t border-[#eee]" />

            {/* Apple Card strip */}
            <Section>
              <Row>
                <Column align="center" className="block">
                    <Img
                    src={`${baseUrl}/blackLogo.png`}
                    width="200"
                    height="80"
                    alt="Blue Grid"
                    className="my-0"
                    />
                </Column>
              </Row>
            </Section>

            {/* <Section>
              <Row>
                <Column align="center" className="my-4 block">
                  <Text className="text-[24px] font-medium">Save 3% on all your Apple purchases.</Text>
                </Column>
              </Row>
            </Section> */}
            <Hr className="my-5 border-t border-[#eee]" />

            <Text className="m-0 text-center text-[12px] text-[#666]">
              <Link href={baseUrl} className="text-[#0073FF] underline">
                Log In
              </Link>{" "}
              •{" "}
              <Link href="https://www.apple.com/" className="text-[#0073FF] underline">
                Terms of Sale
              </Link>{" "}
              •{" "}
              <Link href="https://www.apple.com/legal/privacy/" className="text-[#0073FF] underline">
                Privacy Policy
              </Link>
            </Text>
              <Text className="mt-6 text-center text-[12px] text-[#9ca3af]">
                            © {new Date().getFullYear()} BlueGrid Valuations. All rights reserved.
                    </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
