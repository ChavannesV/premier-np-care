import type { Config } from "@keystatic/core";

interface StorageOptions {
  mode?: string;
  cloudProject?: string;
  isDevelopment: boolean;
  repo: `${string}/${string}`;
}

/** Public configuration only. Credentials are checked in the API route. */
export function resolveEditorStorage({ mode, cloudProject, isDevelopment, repo }: StorageOptions): {
  storage: Config["storage"];
  cloud?: { project: string };
  error?: string;
} {
  const selected = mode?.trim() || (isDevelopment ? "local" : "github");
  const disabled = (error: string) => ({ storage: { kind: "github" as const, repo }, error });

  if (selected === "local") {
    return isDevelopment
      ? { storage: { kind: "local" } }
      : disabled("Local editing is available only with npm run dev. Choose cloud or github for production.");
  }
  if (selected === "cloud") {
    const project = cloudProject?.trim();
    if (!project || !/^[\w.-]+\/[\w.-]+$/.test(project)) {
      return disabled("Set NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT to the team/project identifier from Keystatic Cloud, then redeploy.");
    }
    return { storage: { kind: "cloud" }, cloud: { project } };
  }
  if (selected === "github") return { storage: { kind: "github", repo } };
  return disabled("NEXT_PUBLIC_KEYSTATIC_STORAGE must be local, github, or cloud.");
}
