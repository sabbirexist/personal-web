p = "components/site/contact-form.tsx"
s = open(p, encoding="utf-8").read()
old = '      if (!res.ok) throw new Error(json.error || "Something went wrong. Try again?");'
new = '''      if (!res.ok) {
        const failure = new Error(json.error || "Something went wrong. Try again?") as Error & {
          mailto?: string;
        };
        failure.mailto = json.mailto;
        throw failure;
      }'''
assert old in s
s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("mailto attached:", "failure.mailto = json.mailto" in s)
