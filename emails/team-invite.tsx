import { ProductEmail } from "../features/email/email-template";
import { previewOrigin, previews } from "../features/email/preview-data";

export default function TeamInvitePreview() {
  return (
    <ProductEmail message={previews["team-invite"]} origin={previewOrigin} />
  );
}
