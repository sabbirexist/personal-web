# 2. contact route: graceful 503 with a direct-email fallback
p = "app/api/contact/route.ts"
s = open(p, encoding="utf-8").read()
old = '''  await updateContent((content) => {
    content.messages.unshift({
      id: uid("m"),
      name,
      email,
      projectType,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });
  });

  // light abuse guard: keep the inbox from growing unbounded
  const after = await readContent();
  if (after.messages.length > 500) {
    await updateContent((content) => {
      content.messages = content.messages.slice(0, 500);
    });
  }

  return NextResponse.json({ ok: true });'''
new = '''  try {
    await updateContent((content) => {
      content.messages.unshift({
        id: uid("m"),
        name,
        email,
        projectType,
        message,
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    // light abuse guard: keep the inbox from growing unbounded
    const after = await readContent();
    if (after.messages.length > 500) {
      await updateContent((content) => {
        content.messages = content.messages.slice(0, 500);
      });
    }
  } catch {
    let mailto = "hello@sabbir.studio";
    try {
      mailto = (await readContent()).site.email;
    } catch {}
    return NextResponse.json(
      { error: "The form can't save right now.", mailto },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });'''
assert old in s
s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("contact fallback:", "can't save right now" in s)
