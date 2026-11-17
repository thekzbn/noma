<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commit and PR message format

Use `message` as the commit subject or PR title, `description` as the body.

Every commit description: one paragraph under "Why the changes were made."
PR description: two paragraphs under "Why the changes were made."

Format:
    message: <type>(scope): summary
    description:

    Why the changes were made:
    <paragraph(s)>

    Changes made:
    - <change>. `<path>` [+]/[-]/[:]

Types: feat, fix, refactor, docs, test. No placeholders. Only list files that changed.

