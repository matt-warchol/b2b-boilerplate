import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function SetupReminderPreview() {
  return (
    <ProductEmail message={previews["setup-reminder"]} origin={previewOrigin} />
  );
}
