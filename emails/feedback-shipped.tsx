import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function FeedbackShippedPreview() {
  return (
    <ProductEmail message={previews["feedback-shipped"]} origin={previewOrigin} />
  );
}
