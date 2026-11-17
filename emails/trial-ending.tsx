import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function TrialEndingPreview() {
  return (
    <ProductEmail message={previews["trial-ending"]} origin={previewOrigin} />
  );
}
