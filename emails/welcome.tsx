import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function WelcomePreview() {
  return <ProductEmail message={previews["welcome"]} origin={previewOrigin} />;
}
