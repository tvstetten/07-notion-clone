"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FileIcon, Plus } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { NavItemDocument } from "./nav-item-document";
import { NavItem } from "./nav-item";
import { toast } from "sonner";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const create = useMutation(api.documents.create);

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onCreate = () => {
    if (!parentDocumentId) return;

    const promise = create({
      title: "Untitled",
      parentDocument: parentDocumentId,
    }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created!",
      error: "Failed to create a new note",
    });
  };

  if (documents === undefined) {
    return (
      <>
        <NavItemDocument.Skeleton level={level} />
        {level === 0 && (
          <>
            <NavItemDocument.Skeleton level={level} />
            <NavItemDocument.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  if (level > 0 && documents.length == 0) {
    return (
      <NavItem level={level}>
        <NavItem.Label
          label="<No pages inside!>"
          className="cursor-default"
        />
        <NavItem.Button icon={Plus} onClick={onCreate}/>
      </NavItem>
    );
  }

  return (
    <>
      {documents?.map((document) => (
        <div key={document._id}>
          <NavItemDocument
            documentId={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={document.icon || FileIcon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList
              parentDocumentId={document._id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};
