/** VersionsPanel: every version, newest first. Choosing one previews it. */

import VersionItem, {
  type VersionSource as VersionLabel,
} from "@/components/ui/VersionItem";
import { relativeTime } from "@/lib/relative-time";
import type { Version, VersionSource } from "@/models";

const SOURCE_LABEL: Record<VersionSource, VersionLabel> = {
  generated: "Generated",
  edited: "Edited",
  restored: "Restored",
  remixed: "Remixed",
};

export interface VersionsPanelProps {
  versions: Version[];
  /** The version open in the workspace. */
  viewingId: string | null;
  onSelect: (id: string) => void;
}

export default function VersionsPanel({
  versions,
  viewingId,
  onSelect,
}: VersionsPanelProps) {
  if (versions.length === 0) {
    return (
      <p className="text-body-sm text-text-secondary">
        Versions appear here. Each change you ask for saves a new one.
      </p>
    );
  }
  const headId = versions[0].id;
  return (
    <ul aria-label="Versions" className="flex flex-col gap-1">
      {versions.map((version) => (
        <li key={version.id}>
          <VersionItem
            version={version.number}
            summary={version.summary}
            time={relativeTime(version.created_at)}
            source={SOURCE_LABEL[version.source]}
            current={version.id === headId}
            selected={version.id === viewingId && version.id !== headId}
            onSelect={() => onSelect(version.id)}
          />
        </li>
      ))}
    </ul>
  );
}
