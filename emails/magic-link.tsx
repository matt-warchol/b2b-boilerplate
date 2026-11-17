import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function MagicLinkPreview() {
  return (
    <ProductEmail message={previews["magic-link"]} origin={previewOrigin} />
  );
}
