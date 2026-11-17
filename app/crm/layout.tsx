import "@fontsource-variable/geist";
import "./crm.css";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FeedbackWidget />
    </>
  );
}
