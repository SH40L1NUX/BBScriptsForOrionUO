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

// Great Reflex Ring 1
Orion.UseObject('GRR1'); // you will need to define the Great Reflex Ring within Lists/Objects as you will carry more than just one and each has its own timer
Orion.Print('[ *GREAT REFLEX RING 1* ]'); //tells you what GRR you have just used
Scripts.Utils.playerPrint('<GRR1>') //prints above you what is the number of GRR you have used in case there is about hundred things going on around you and you need to focus
Orion.Wait('300') //wait a bit, however you do have already set default wait timer in your Orion, this rather helps when your CPU or RAM gets a bit overloaded. Hard fix.
Orion.Unequip('ring'); //takes off that Reflex Ring because, well you are wearing an Attack Ring instead and this is the only solution to it
Orion.Equip('Slot_ATTACK RING') // equips back that Attack Ring you wear like a wedding ring, you have guess right, you got likely also some defense ring too.
var timer = 197000; // sets the variable for the 'timer' that will run aside since now
Orion.AddDisplayTimer('*GRR1*', timer , 'LeftTop', 'Line|Bar', '*GRR1*', 0, 235, '0x77B', 0, '0x77B'); // sets the timer to run in a specific part of your screen, the downside is that you might have different minotor and resolutions than me. Which in that case you will edit that number 235 into where it fits the best, either way it will display on top left
