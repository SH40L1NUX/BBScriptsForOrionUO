# BBScriptsForOrionUO
S1X-Z3R0 JavaScript programming for an extensive functionality within Orion UO.

# Ultima Online — Orion UO JavaScripting
https://github.com/Hotride/OrionUO

Custom script library for **Orion UO Client** (JavaScript-based). 

## What You'll Find Here

- **Creativity-first approach.** Unconventional, outside-the-box solutions to problems not many ever bothered to solve properly, or at all.
- **Minimal code, maximum function.** Every script is lean and lightweight — stripped of unnecessary complexity, yet delivering flawless, production-ready behavior. If it can be done in 30 lines and work well, it will be.
- **Unique and unusual solutions.** When the standard approach fails (or doesn't exist), these scripts fill the gap. Expect patterns and techniques you won't find scattered across outdated forums or abandoned repos.
- **Demonstrated proficiency.** Every script has been battle-tested on a live shard where one small mistake means that you and your team wipe out with their full equipments and meet up by the resser in Brittain.
- **Functionality isn't a goal — it's the baseline.**

## Philosophy

> Write less. Do more. Break nothing. Its like strike first, strike hard, no mercy Kobra Kai stuff. ;-D

Orion's JavaScript engine is powerful enough to handle complex automation, but most scripters over-engineer everything. 
This repo proves that clean, minimal code — when written with understanding — outperforms bloated alternatives every time, although I might not ever care if you got any bandages on you, so that basic check if you got it at all is somehow pointless.
Hotkey will use the bandage on yourself and display a precise timer above you so you can time the next one without risking to fail the first one by not having enough patience. I do not ever care if you do have any bandages. Basic equip rules.
While scripts allows to use way more functions including variables and complex logical methods of programming, hotkeys are usually enough to do what you need the most without creating extra fluff and more variables within your index.js script.

## What's Included

| Combat scripts | UI & Automation (More often Half-Auto) | Hotkey bindings |

## Requirements

- **Orion UO Client** (latest stable build) and an account on Czech UO server www.darkparadise.cz
- basic JavaScript knowledge (optional — scripts are self-contained)
<img width="568" height="433" alt="image" src="https://github.com/user-attachments/assets/835ad453-41e9-4929-ac6c-3a33e00e5702" />


```js
// Example usage

// - Heart Of Dark Forest 
Orion.UseType('0x136C', '0x0B89'); //Item type and colour of Heart of Dark Forest
Scripts.Utils.playerPrint('*HODF*' ,'0x044'); // Displays above character that HODF has been used in a specific green colour as colour coding is indeed very important 
Orion.Print('[ *HODF* ]'); var timer = 135000; // variable of the timer
Orion.AddDisplayTimer('*HODF*', timer , 'LeftTop', 'Line|Bar', '*HODF*', 0, 160, '0x10B', 0, '0x20B'); // displays the timer of HODF on top left side of the screen for clear visual info
