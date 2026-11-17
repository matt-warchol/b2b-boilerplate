import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function FirstResultPreview() {
  return (
    <ProductEmail message={previews["first-result"]} origin={previewOrigin} />
  );
}
