"use client";

import { makePage } from "@keystatic/next/ui/app";
import config, { editorConfigurationError } from "../../../keystatic.config";

const KeystaticApp = makePage(config);

export default function SiteEditor() {
  if (editorConfigurationError) {
    return (
      <main className="mx-auto max-w-xl p-8">
        <h1 className="text-2xl font-semibold">Site editor needs setup</h1>
        <p className="mt-4" role="alert">{editorConfigurationError}</p>
        <p className="mt-4">The public website is still available. See the setup instructions in README.md.</p>
      </main>
    );
  }
  return <KeystaticApp />;
}
