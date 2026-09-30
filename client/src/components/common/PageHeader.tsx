import React from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div className="space-y-3">
      <span className="chip">
        <span className="dot" />
        {eyebrow}
      </span>
      <h1 className="headline text-4xl sm:text-5xl">{title}</h1>
      {description && <p className="max-w-xl text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
