## Project Title

GBDA302_Week 4_Side Quest 4: JSON Platformer

---

## Author

Min Htet Naing, dmnaing (21008098)

---

## Description

This project builds on the Week 4 platformer example to create a small playable level system using JSON data, reusable classes, and loop-based world generation. Levels are defined externally in a JSON file and dynamically rendered at runtime. A blob player can move, jump, and progress between levels by reaching a door.

The focus of this side quest is not advanced gameplay, but clean structure, data-driven design, and clear separation of responsibilities across files.

---

## Setup and Interaction Instructions

- Open the GitHub Pages link in Google Chrome.
- **Move:** A / D or ← / →
- **Jump:** Space / W / ↑
- **Next Level (optional):** N
- **Goal:** Make the object reach the door and which will get you into the next level

---

## Iteration Notes

a. Post-Playtest (3 changes)

Added a clearly visible goal zone defined in the JSON level data to make the win condition more obvious to players.

Adjusted platform spacing and heights to improve jump readability and reduce trial-and-error movement.

Implemented automatic level progression when the player reaches the goal, removing the need for manual input.

b. Post-Showcase (2 planned improvements)

Add visual feedback when the player reaches the goal, such as a short animation or on-screen text, to better communicate success.

Introduce hazards or alternate platform types defined through JSON data to add variety and challenge without changing core mechanics.

---

## Assets

No external assets were used.

---

## GenAI

I used AI to help developing the code and make adjustments for this side quest.

---
