# ChatGPT Meter

An independent ChatGPT usage-meter subproject inside the `claude-meter` repository.

**Release line:** `chatgpt-v0.1.0`  
**Status:** Web prototype scaffold; desktop-native support is planned and not yet verified.

## Scope
- Chrome and Edge extension for `https://chatgpt.com/*`.
- Compact in-page meter.
- Reads only visible text from the official ChatGPT Usage settings page when the user visits it.
- Stores the latest readable snapshot in browser-local extension storage.
- No cookies, passwords, conversation text, hidden application state, or network telemetry.

## Important accuracy limitation
OpenAI does not provide a documented public API for reading every personal ChatGPT plan limit. This project therefore does not promise complete or real-time account usage. It displays only values that can be confidently read from the visible Usage page; otherwise it says **Not detected**. Snapshots are timestamped.

## Install Web prototype
1. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
2. Enable Developer mode.
3. Select **Load unpacked** and choose the `chatgpt/extension` directory.
4. Open [ChatGPT Usage settings](https://chatgpt.com/settings/usage) while signed in.
5. Return to a ChatGPT conversation to see the meter.

## Desktop support
See [desktop status](desktop/README.md). Windows and macOS native ChatGPT desktop app support is a separate workstream. A browser extension must not be assumed to inject into the native app. Desktop support will be marked supported only after testing on both operating systems.

## Privacy
All captured values remain in `chrome.storage.local`. The extension makes no external network requests and does not read authentication material.
