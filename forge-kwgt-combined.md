# Forge · combined KWGT widget (Train + Fuel on one tile)

One home-screen tile: **today's session + intensity** up top, a divider, then
**calories left + macros** below — with the cycle phase in the corner. It reuses
the exact globals and formulas from the two separate guides, arranged together.
Best at a **4×3** widget.

> Populate it with **both** copy buttons in Forge (Train → *Copy week for KWGT*
> and Fuel → *Copy for KWGT*). See `forge-tasker-sync.md` to push them hands-off.

---

## Globals (union of both widgets)

**Training:** `s1`…`s7` (Text), `i1`…`i7` (Number), `today` (Number, =1),
`style` (Text), `days` (Number)
**Nutrition:** `target`, `protein`, `carbs`, `fat`, `consumed` (Number, =0)
**Shared:** `phase` (Text)

Both Forge copy lines include `phase=…`, so it stays consistent whichever you
paste last.

---

## Layout mockup (4×3, ~380×260 dp)

```
┌────────────────────────────────────────────────┐
│ FORGE   Fri 3 Jul                    Follicular  │  header + phase
│                                                  │
│ TODAY                                            │
│ Upper                     ▓▓▓▓▓▓▓▓▓░░░   4 / 5    │  session + intensity
│ Day 2 / 7  ·  Weightlifting                      │
│ ────────────────────────────────────────────────│  divider
│ FUEL                                             │
│ 1 480  kcal left          ▓▓▓▓▓▓▓░░░░   68%       │  calories + bar
│ P 104g   C 299g   F 60g          [+250] [Reset]  │  macros + log
│                                          [ Next ]│  advance day
└────────────────────────────────────────────────┘
```

### Group structure
- **Root = Overlap Group**
  - **Background** — Rounded Rectangle, fills tile
  - **Header row** — Stack Group · Horizontal, Anchor Top, Padding 8%: `FORGE  $df(EEE d MMM)$` (left) … `phase` (right)
  - **Content = Stack Group · Vertical**, Anchor Top Left, Padding Left 8%, Top 18%:
    - `TODAY` label · Session · (Intensity bar + label row) · Position/style
    - **Divider** — thin Rounded Rectangle, `#2A2F39`, height 2
    - `FUEL` label · Calories-left line · Calorie bar · Macros
  - **Chips** — Stack Group · Horizontal, Anchor Bottom Right, Padding 8%: `+250` `Reset` `Next`

---

## Formulas

**Header:** `FORGE   $df(EEE d MMM)$`
**Phase (corner):** `$if(gv(phase)!="", gv(phase), "")$`  · colour `#E08AB0`

**Session (big):**
```
$if(gv(today)=1,gv(s1),gv(today)=2,gv(s2),gv(today)=3,gv(s3),gv(today)=4,gv(s4),gv(today)=5,gv(s5),gv(today)=6,gv(s6),gv(s7))$
```
**Intensity bar — Level (fx):**
```
(if(gv(today)=1,gv(i1),gv(today)=2,gv(i2),gv(today)=3,gv(i3),gv(today)=4,gv(i4),gv(today)=5,gv(i5),gv(today)=6,gv(i6),gv(i7)))*20
```
**Intensity label:** `$if(gv(today)=1,gv(i1),…,gv(i7))$ / 5`  *(same chain as above)*
**Position:** `Day $gv(today)$ / 7  ·  $gv(style)$`

**Calories left (big):** `$if(gv(target)>0, round(gv(target)-gv(consumed)), 0)$`
**Status:** `$if(gv(consumed)>gv(target), "kcal over", "kcal left")$`
**Calorie bar — Level (fx):** `if(gv(target)>0, round(gv(consumed)/gv(target)*100), 0)`
 — Foreground (fx): `if(gv(consumed)>gv(target), "#FF5A3C", "#F6B33D")`
**Macros:** `P $gv(protein)$g   C $gv(carbs)$g   F $gv(fat)$g`

### Touch actions (Change Global)
| Chip   | Global   | New value                              |
|--------|----------|----------------------------------------|
| `Next` | today    | `$if(gv(today)>=7, 1, gv(today)+1)$`   |
| `+250` | consumed | `$gv(consumed)+250$`                   |
| `Reset`| consumed | `0`                                    |

---

## Colours (Forge palette)
```
Background #0F1115   Text #ECEDF1   Amber #F6B33D
Line/track #2A2F39   Muted #7E8593  Over #FF5A3C   Cycle #E08AB0
```
Section labels (`TODAY`, `FUEL`): mono, 11, `#F6B33D`, letter-spacing +1.
Big values: `#ECEDF1` bold. Bars: amber on `#2A2F39` track.

---

## Getting data in
- **Manual:** paste the Train line, then the Fuel line, into your globals.
- **Hands-off:** use the one Tasker task in `forge-tasker-sync.md` — it parses
  either Forge copy line and pushes every value to KWGT, plus daily auto-reset of
  `consumed` and auto-advance of `today`.
