import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "react-email";
import { emailBrand } from "../../content/email";
import { emailLinks, messageCopy, type EmailMessage } from "./messages";

// Single-column layout composed from React Email's open-source components.
export function ProductEmail({
  message,
  origin,
}: {
  message: EmailMessage;
  origin: string;
}) {
  const copy = messageCopy(message);
  const links = emailLinks(message, origin);
  const firstName = message.firstName?.trim();

  return (
    <Html lang="en">
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body
        style={{
          margin: 0,
          backgroundColor: "#f7f7f8",
          fontFamily: "Arial, sans-serif",
          color: "#18181b",
        }}
      >
        <Container
          style={{
            margin: "24px auto",
            maxWidth: "560px",
            padding: "28px 24px",
            backgroundColor: "#ffffff",
          }}
        >
          <Text
            style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 20px" }}
          >
            {emailBrand.name}
          </Text>
          <Heading
            as="h1"
            style={{ fontSize: "26px", lineHeight: "32px", margin: "0 0 24px" }}
          >
            {copy.heading}
          </Heading>
          {firstName && (
            <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
              Hi {firstName},
            </Text>
          )}
          {copy.paragraphs.map((paragraph) => (
            <Text
              key={paragraph}
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              {paragraph}
            </Text>
          ))}
          <Button
            href={links.actionUrl}
            style={{
              margin: "8px 0 12px",
              padding: "12px 18px",
              borderRadius: "6px",
              backgroundColor: emailBrand.accent,
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            {copy.action}
          </Button>
          {copy.signature && (
            <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
              {copy.signature}
            </Text>
          )}
          {links.unsubscribeUrl && (
            <>
              <Hr style={{ borderColor: "#e4e4e7" }} />
              <Link
                href={links.unsubscribeUrl}
                style={{
                  color: "#52525b",
                  fontSize: "13px",
                  textDecoration: "underline",
                }}
              >
                Unsubscribe from onboarding and trial reminders
              </Link>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}
