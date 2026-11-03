# 1. store: readable message instead of EROFS on read-only deployments
p = "lib/store.ts"
s = open(p, encoding="utf-8").read()
s = s.replace('''export async function writeContent(content: Content): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });''',
'''export const isReadOnlyDeployment = () => Boolean(process.env.VERCEL);

export async function writeContent(content: Content): Promise<void> {
  if (isReadOnlyDeployment()) {
    throw new Error(
      "This deployment is read-only. Editing needs a database or blob store — run the site locally to change content."
    );
  }
  await fs.mkdir(DATA_DIR, { recursive: true });''')
open(p, "w", encoding="utf-8").write(s)
print("store guard:", "isReadOnlyDeployment" in s)
