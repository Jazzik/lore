---
name: i18n-parity-check
description: Diff the key sets of messages/ru.json and messages/en.json to catch missing or extra translation keys before they cause a runtime MISSING_MESSAGE error
metadata:
  user-invocable: false
---

# i18n Parity Check

LORE's translations live in `messages/ru.json` (default locale) and `messages/en.json`, hand-maintained with no shared schema. A key present in one but not the other only surfaces as a runtime `next-intl` `MISSING_MESSAGE` error when someone happens to view that locale — easy to miss in review.

Run this check proactively whenever you (Claude) have just edited either `messages/ru.json` or `messages/en.json`, or before reporting i18n-related work as done.

## How to run it

```bash
node .claude/skills/i18n-parity-check/check-parity.js
```

The script recursively walks both JSON trees and reports:
- keys present in `ru.json` but missing from `en.json`
- keys present in `en.json` but missing from `ru.json`

Exit code is non-zero if any mismatch is found.

## What to do with the result

- If it reports missing keys, add the missing key to the other locale file with a real (not placeholder) translation — don't stub it with `"TODO"`, since that would ship untranslated copy silently.
- If both files are in parity, say so briefly and move on — no need to report a clean check at length.
