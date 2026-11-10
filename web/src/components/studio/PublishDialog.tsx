/** PublishDialog: sends the current version for review (CON-006). */

import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { Project } from "@/models";

export interface PublishDialogProps {
  project: Project;
  version: number;
  publishing: boolean;
  error: string | null;
  onPublish: () => void;
  onClose: () => void;
}

export default function PublishDialog({
  project,
  version,
  publishing,
  error,
  onPublish,
  onClose,
}: PublishDialogProps) {
  return (
    <Modal
      open
      onOpenChange={(open) => !open && !publishing && onClose()}
      title={`Publish ${project.title}?`}
      description={`Version ${version} is reviewed against the content rules first. Once it passes, the game gets a public link in the Arcade where anyone can play and remix it. The prompt that made it is shown on its page.`}
      size="sm"
      footer={
        <>
          <Button kind="ghost" onClick={onClose} disabled={publishing}>
            Cancel
          </Button>
          <Button onClick={onPublish} loading={publishing}>
            Send for review
          </Button>
        </>
      }
    >
      {error ? <Banner kind="danger">{error}</Banner> : null}
    </Modal>
  );
}
