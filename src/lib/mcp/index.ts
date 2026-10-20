import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listBrands from "./tools/list-brands";
import listContent from "./tools/list-content";
import getBrandProfile from "./tools/get-brand-profile";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "brainy-unica",
  title: "Brainy Unica",
  version: "0.1.0",
  instructions:
    "Tools for Brainy, the Decision Layer for brand marketing. Read the signed-in user's brands, their content items (posts and schedule), and the AI-analyzed brand profile.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listBrands, listContent, getBrandProfile],
});
