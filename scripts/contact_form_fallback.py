p = "components/site/contact-form.tsx"
s = open(p, encoding="utf-8").read()

s = s.replace('''  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");''',
'''  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState<{ href: string; address: string } | null>(null);''')

s = s.replace('''    setStatus("sending");
    setError("");''',
'''    setStatus("sending");
    setError("");
    setFallback(null);''')

old = '''    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }'''
new = '''    } catch (err) {
      const mailto = (err as { mailto?: string }).mailto || email;
      const bodyText = [
        `Name: ${data.get("name") ?? ""}`,
        `Email: ${data.get("email") ?? ""}`,
        `Project: ${projectType}`,
        "",
        String(data.get("message") ?? ""),
      ].join("\\n");
      setFallback({
        address: mailto,
        href: `mailto:${mailto}?subject=${encodeURIComponent("Project enquiry — " + projectType)}&body=${encodeURIComponent(bodyText)}`,
      });
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }'''
assert old in s
s = s.replace(old, new)

old = '''      {status === "error" && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[0.82rem] text-red-400">
          {error}
        </p>
      )}'''
new = '''      {status === "error" && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[0.82rem] text-red-400">
          <p>{error}</p>
          {fallback && (
            <a
              href={fallback.href}
              className="mt-1.5 inline-flex items-center gap-1 font-medium underline decoration-red-400/40 underline-offset-4 hover:text-red-300"
            >
              Email {fallback.address} instead
              <Icon name="arrowUpRight" size={12} />
            </a>
          )}
        </div>
      )}'''
assert old in s
s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("form fallback:", "Email {fallback.address} instead" in s)
