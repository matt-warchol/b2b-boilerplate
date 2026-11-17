import "@fontsource-variable/geist";
import "./crm.css";
import { FeedbackMount } from "@/components/feedback/feedback-mount";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FeedbackMount />
    </>
  );
}
