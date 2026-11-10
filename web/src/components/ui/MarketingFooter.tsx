/**
 * MarketingFooter: the CueLABS marketing standard footer. A brand block,
 * four link columns (Product, Docs, Community, Legal) and the legal bar
 * with the language selector and the security policy link. The inventory
 * is fixed: the links are not props.
 */

import { cn } from "@/lib/cn";
import LogoPlaceholder from "./LogoPlaceholder";

export interface MarketingFooterProps {
  /** Copyright year. Defaults to the current year. */
  year?: number;
  className?: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export const MARKETING_FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Try Cloud", href: "/signin" },
      { label: "Self Host", href: "#self-host" },
      { label: "Consoles", href: "#consoles" },
    ],
  },
  {
    heading: "Docs",
    links: [
      { label: "Docs", href: "https://cuesoft.gitbook.io/consoless" },
      {
        label: "Quickstart",
        href: "https://cuesoft.gitbook.io/consoless/setup",
      },
      {
        label: "API reference",
        href: "https://consoless.cuesoft.io/docs/api",
      },
      {
        label: "Self-host guide",
        href: "https://cuesoft.gitbook.io/consoless/system/deployment",
      },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/cuesoftinc/consoless" },
      { label: "Discord", href: "https://discord.gg/CDfZxxrxbb" },
      {
        label: "Roadmap",
        href: "https://cuesoft.gitbook.io/consoless/product/roadmap",
      },
      { label: "CueLABS™", href: "https://cuelabs.cuesoft.io" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "https://privacy.cuesoft.io" },
      { label: "Terms", href: "https://terms.cuesoft.io" },
      { label: "Status", href: "https://status.cuesoft.io" },
    ],
  },
];

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

const HOVER =
  "hover:text-text-primary transition-colors duration-fast ease-enter motion-reduce:transition-none";

const COLUMN_LINK_CLASSES = cn(
  "rounded-sm text-body-sm text-text-secondary",
  HOVER,
  FOCUS_RING,
);

const LEGAL_LINK_CLASSES = cn("rounded-sm underline", HOVER, FOCUS_RING);

const externalProps = (href: string) =>
  /^https?:\/\//.test(href) ? { target: "_blank", rel: "noreferrer" } : {};

export default function MarketingFooter({
  year = new Date().getFullYear(),
  className,
}: MarketingFooterProps) {
  return (
    <footer
      className={cn("border-t border-border-default bg-bg-base", className)}
    >
      <div className="mx-auto max-w-[1312px] px-4 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
            <LogoPlaceholder />
            <p className="text-body-sm text-text-secondary">
              Describe it. Play it. Share it.
            </p>
            <p className="text-caption text-text-muted">
              An open-source product by CueLABS™
            </p>
          </div>
          {MARKETING_FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-[11px] tracking-wider text-text-muted uppercase">
                {column.heading}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...externalProps(link.href)}
                      className={COLUMN_LINK_CLASSES}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-border-default pt-6 text-caption text-text-muted">
          <p data-testid="footer-legal">
            ©{" "}
            <a
              href="https://cuesoft.io"
              target="_blank"
              rel="noreferrer"
              className={LEGAL_LINK_CLASSES}
            >
              Cuesoft Inc.
            </a>{" "}
            {year}. Consoless.{" "}
            <a
              href="https://cuelabs.cuesoft.io"
              target="_blank"
              rel="noreferrer"
              className={LEGAL_LINK_CLASSES}
            >
              CueLABS™ Division
            </a>
            .{" "}
            <a
              href="https://github.com/cuesoftinc/consoless/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className={LEGAL_LINK_CLASSES}
            >
              MIT License
            </a>
            .
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/cuesoftinc/consoless/blob/main/SECURITY.md"
              target="_blank"
              rel="noreferrer"
              className={LEGAL_LINK_CLASSES}
            >
              Security policy
            </a>
            <select
              aria-label="Language"
              defaultValue="en"
              className={cn(
                "rounded-md border border-border-default bg-bg-base px-2 py-1 text-caption text-text-secondary",
                FOCUS_RING,
              )}
            >
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
