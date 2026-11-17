import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function PasswordResetPreview() {
  return (
    <ProductEmail message={previews["password-reset"]} origin={previewOrigin} />
  );
}
