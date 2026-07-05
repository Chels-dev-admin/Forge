# Forge → KWGT: zero-tap auto-sync on copy

Make the sync fire **the instant you tap a Copy button in Forge** — no shortcut,
no extra tap. This watches the clipboard and, only when it sees a Forge line,
runs the sync task from `forge-tasker-sync.md`.

> **Reality check (Android 10+):** Google blocked background clipboard reads in
> Android 10. Tasker has a working built-in fix, but it needs a **one-time
> permission grant** (below) and can be a little version-sensitive. Once granted,
> it's reliable. If you'd rather not bother, the one-tap shortcut in
> `forge-tasker-sync.md` needs no permissions at all.

You do **not** need AutoTools for this — Tasker's own clipboard event does it.
(An AutoTools variant is at the bottom if you already use it.)

---

## Step 1 — Grant clipboard access (one time)

Pick either route.

**A) From a computer (USB debugging on):**
```
adb shell pm grant net.dinglisch.android.taskerm android.permission.READ_LOGS
adb shell am force-stop net.dinglisch.android.taskerm
```
Then reopen Tasker. (Some devices also want
`adb shell pm grant net.dinglisch.android.taskerm android.permission.WRITE_SECURE_SETTINGS`.)

**B) No computer (Android 11+ wireless):** Tasker can run it on-device — enable
**Developer options → Wireless debugging**, then use Tasker's **ADB Wi-Fi**
action to run the same `pm grant … READ_LOGS` command. (Tasker's guide walks you
through pairing.)

If clipboard events stop after a Tasker update, re-run the grant and force-stop.

---

## Step 2 — Create the auto-trigger profile

Tasker → **Profiles → ＋ → Event → Variable → Variable Set**:
- *Variable:* `%CLIP`
- *Value:* `*`   (fires on any clipboard change)
- *User Variables Only:* Off

Link it to a task called **"Forge KWGT autosync"** (next step).

---

## Step 3 — The autosync task (filters, then reuses your sync)

This checks the clipboard actually looks like a Forge line before doing anything,
so normal copying never triggers KWGT.

1. **If**  `%CLIP` **Matches (Regex)**  `^(target=|s1=).*`
   *(fuel lines start with `target=`, training lines start with `s1=`)*

2.   **Variable Set** — `%line` to `%CLIP`

3.   **Variable Split** — Name `%line`, Splitter `; ` (semicolon **+ space**)

4.   **For** — Variable `%pair`, Items `%line()`

5.     **Variable Split** — Name `%pair`, Splitter `=`

6.     **Plugin → KWGT → Send Variable** — name `%pair1`, value `%pair2`

7.   **End For**

8.   *(optional)* **Flash** — `Forge synced (%line() values)`

9. **End If**

That's the same loop as Task A in `forge-tasker-sync.md`, just wrapped in the
`If %CLIP matches …` guard and driven by the clipboard event instead of a tap.

**Result:** tap **Copy for KWGT** (Fuel) or **Copy week for KWGT** (Train) in
Forge → the widget updates on its own. Do both once and the combined tile is
fully populated.

---

## Why the regex guard matters
The `%CLIP` event fires on **every** copy you make anywhere. The
`^(target=|s1=)` check means the task only acts on Forge's export lines and
ignores everything else you copy — no accidental KWGT writes, no loops (the task
never writes to the clipboard itself).

---

## Optional — AutoTools variant
If you already run AutoTools and prefer its clipboard handling:
- Profile → **Event → Plugin → AutoTools → Clipboard** (enable clipboard
  monitoring in AutoTools; it uses the same Android permission, so Step 1 still
  applies).
- In the task, use AutoTools' clipboard output variable in place of `%CLIP`
  (AutoTools names it in the action's *Variables* section), then the same
  filter → split → For → Send Variable loop.

No real advantage over the native event for this job — use whichever you find
more reliable on your phone.

---

## Still want it truly hands-off without clipboard permissions?
The permission-free alternative is the **one-tap shortcut** (put the sync task on
a home-screen button): copy in Forge, tap the button. Two taps total, zero setup.
Everything downstream — the daily `consumed` reset and `today` advance
(Profiles B/C in `forge-tasker-sync.md`) — runs automatically regardless.
