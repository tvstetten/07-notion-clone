"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { MoreHorizontal, Trash } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CO_POPUP_MENU_SHADOW } from "@/lib/utils";
import { useSidebarContext } from "@/components/mylib/sidebar";

interface MenuProps {
  documentId: Id<"documents">;
}

export const documentMenuContent = (documentId: Id<"documents">) => {
  // const { user } = useUser();
  // ?.fullName
  const user = "<unknown>";

  console.log("documentMenuContent: documentId:", documentId);

  const onArchive = () => {
    console.log("documentMenuContent.onArchive: documentId:", documentId);
    const router = useRouter();
    const archive = useMutation(api.documents.archive);
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });

    router.push("/documents");
  };

  return (
    <DropdownMenuContent
      // className={CO_POPUP_MENU_SHADOW()}
      className={"shadow-[2px_5px_14px_rgba(250,230,0,0.7)]"}
      align="start"
      alignOffset={8}
      forceMount
    >
      <DropdownMenuItem onClick={onArchive}>
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="p-2 text-xs text-muted-foreground">
        Last edited by: {user}
      </div>
    </DropdownMenuContent>
  );
};

export const DocumentMenuButton = ({ documentId }: MenuProps) => {
  const lockOpenState = useSidebarContext().lockOpenState;
  return (
    <DropdownMenu onOpenChange={(open) => lockOpenState(open)}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {documentMenuContent(documentId)}
    </DropdownMenu>
  );
};

DocumentMenuButton.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
