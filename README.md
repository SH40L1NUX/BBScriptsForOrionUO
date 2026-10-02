# BBScriptsForOrionUO
S1X-Z3R0 JavaScript programming for an extensive functionality within Orion UO.

# Ultima Online — Orion UO JavaScripting

Custom script library for **Orion UO Client** (JavaScript-based). Built for players who want their shards to *work* the way they should — without bloat, without hand-holding, and without scripts that break the moment you bump into a wall.

## What You'll Find Here

- **Creativity-first approach.** Unconventional, outside-the-box solutions to problems nobody else bothered to solve properly.
- **Minimal code, maximum function.** Every script is lean and lightweight — stripped of unnecessary complexity, yet delivering flawless, production-ready behavior. If it can be done in 30 lines and work perfectly, it will be.
- **Unique and unusual solutions.** When the standard approach fails (or doesn't exist), these scripts fill the gap. Expect patterns and techniques you won't find scattered across outdated forums or abandoned repos.
- **Demonstrated proficiency.** Every script has been battle-tested on live shards. Perfect functionality isn't a goal — it's the baseline.

## Philosophy

> Write less. Do more. Break nothing.

Orion's JavaScript engine is powerful enough to handle complex automation, but most scripters over-engineer everything. This repo proves that clean, minimal code — when written with understanding — outperforms bloated alternatives every time.

## What's Included

| Category | Description |
|---|---|
| Combat scripts | Smart targeting, auto-potions, spell routing |
| Gathering & crafting | Resource tracking, inventory management, workflow automation |
| Movement & navigation | Pathfinding, waypoint systems, terrain-aware routing |
| UI & automation | Custom dialogs, hotkey bindings, event-driven responses |
| Utilities | Debug tools, logging helpers, shard-specific adapters |

## Requirements

- **Orion UO Client** (latest stable build) and an account on Czech UO server www.darkparadise.cz
- basic JavaScript knowledge (optional — scripts are self-contained)

```js
// Example usage
// Great Reflex Ring 1
Orion.UseObject('GRR1');
Orion.Print('[ *GREAT REFLEX RING 1* ]');
Scripts.Utils.playerPrint('<GRR1>')
Orion.Wait('300')
Orion.Unequip('ring');
Orion.Equip('Slot_ATTACK RING')
var timer = 197000;
Orion.AddDisplayTimer('*GRR1*', timer , 'LeftTop', 'Line|Bar', '*GRR1*', 0, 235, '0x77B', 0, '0x77B');
