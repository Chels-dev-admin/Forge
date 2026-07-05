# Forge → KWGT sync with Tasker (both widgets)

One Tasker task pushes **every** value from a Forge copy line into your KWGT
globals. It works for **both** the Fuel line and the Train line, because they use
the same `key=value; key=value` format. Plus two tiny profiles for daily
auto-reset and auto-advance.

**What you need:** Tasker + the **KWGT** Tasker plugin (installed automatically
with KWGT). In KWGT you'll read pushed values with `$br(Tasker, NAME)$` (see the
"Read in KWGT" note at the end), *or* keep using `$gv(NAME)$` if you paste the
same names into globals — either works; pick one and be consistent.

---

## Task A — "Forge → KWGT sync"  (parses a copied line)

You run this right after tapping a **Copy for KWGT** button in Forge (the value
lands on your clipboard). It reads the clipboard, splits it, and sends each pair.

Create a task (Tasker → **Tasks → ＋ → "Forge KWGT sync"**) with these actions:

1. **Variable Set**
   - *Name:* `%line`
   - *To:* `%CLIP`
   - *(Do maths / append: off)*

2. **Variable Split**
   - *Name:* `%line`
   - *Splitter:* `; `  ← semicolon **and a space**
   - *(This creates the array `%line()`.)*

3. **For**
   - *Variable:* `%pair`
   - *Items:* `%line()`

4.   **Variable Split**  *(inside the For)*
     - *Name:* `%pair`
     - *Splitter:* `=`
     - *(Creates `%pair1` = the name, `%pair2` = the value.)*

5.   **Plugin → KWGT → Send Variable**  *(inside the For)*
     - Open the plugin config. Set:
       - *Variable name / key:* `%pair1`
       - *Value:* `%pair2`
     - Some builds ask which widget/preset — pick the widget you're feeding.

6. **End For**

7. *(optional)* **Flash** → `Synced %line() values to KWGT`

**Use it:** in Forge, tap **Copy week for KWGT** (Train) → run this task. Then tap
**Copy for KWGT** (Fuel) → run it again. Both sets of globals are now populated.
Put the task on a Tasker **home-screen shortcut** so "copy → tap sync" is two taps.

> Want it to run automatically when you copy? Add a trigger with a clipboard-watch
> plugin (e.g. AutoTools "Clipboard" or Tasker's clipboard monitoring), pointing at
> this task. Optional — the manual shortcut is simpler and reliable.

---

## Profile B — daily calorie reset (00:00)

Resets your "eaten today" counter each midnight so the Fuel widget starts fresh.

- **Profile → Time:** From `00:00` To `00:01` (or use an Event → Date/Time).
- **Task:** one action → **Plugin → KWGT → Send Variable**
  - *Variable name:* `consumed`
  - *Value:* `0`

---

## Profile C — daily session advance (00:05)

Rolls the training widget to the next day automatically (so you don't tap "Next").

- **Profile → Time:** From `00:05` To `00:06`.
- **Task:** one action → **Plugin → KWGT → Send Variable**
  - *Variable name:* `today`
  - *Value:* `$if(gv(today)>=7,1,gv(today)+1)$`
  - *(If the plugin won't evaluate a formula in the value field, instead read the
    current `today` into a Tasker var first with a KWGT "read variable" action, do
    the maths in Tasker, and send the number.)*

---

## Read in KWGT

Values sent by the plugin arrive under the **Tasker broadcast**. In your widget
layers, read them with:

```
$br(Tasker, target)$      instead of   $gv(target)$
$br(Tasker, s1)$          instead of   $gv(s1)$
```

Keep `consumed` and `today` as **normal globals** (`gv(...)`) if you also tap them
on the widget, and let Profiles B/C set those same globals. Mixing is fine — just
be consistent per variable: a value you *tap* should be a `gv()` global; a value
only *pushed* from Tasker can be read via `br(Tasker, …)`.

---

## Notes / troubleshooting
- **Clipboard empty?** Make sure you copied in Forge just before running, and that
  Tasker has clipboard access (grant it if Android prompts).
- **Values look shifted?** Check the splitter in step 2 is exactly `; ` (semicolon
  + space) and step 4 is `=`.
- **Names with spaces** (e.g. `Rounds & Application`) are fine — only `;` and `=`
  are used as separators, and Forge never puts those inside a value.
- **Plugin missing?** Reinstall/open KWGT once so its Tasker plugin registers, then
  it appears under Tasker → Plugin → KWGT.
