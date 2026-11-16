import { Building2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function RecordAvatar({
  name,
  color = "lilac",
  square = false,
  className,
}: {
  name: string;
  color?: string;
  square?: boolean;
  className?: string;
}) {
  const person = name === "You" || name === "Alex" ? "Alex Morgan" : name;
  const Icon = square ? Building2 : UserRound;

  return (
    <Avatar
      aria-hidden="true"
      className={cn(
        "size-9 shrink-0",
        color,
        square && "size-8 rounded-md",
        className,
      )}
    >
      {!square && (
        <AvatarImage
          src={"/avatars/" + person.toLowerCase().replaceAll(" ", "-") + ".webp"}
          alt=""
        />
      )}
      <AvatarFallback className="rounded-[inherit] bg-transparent text-inherit">
        <Icon className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}
