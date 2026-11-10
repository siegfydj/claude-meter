# Desktop compatibility — pending

Targets: Windows ChatGPT Desktop and macOS ChatGPT Desktop.

The Web extension is not automatically compatible with the native desktop application. The desktop app's embedded browser/runtime and extension-loading behavior must be tested separately on each OS.

Planned phases:
1. Verify whether the Windows desktop app supports loading a locally packaged extension into the relevant ChatGPT surface.
2. Verify the same independently on macOS.
3. If injection is unavailable, build a small native companion window that reads a locally exported snapshot from the browser extension or a user-approved local bridge.
4. Keep the companion read-only and local. Never extract ChatGPT cookies, passwords, or session tokens.

No native desktop support is claimed in v0.1.0.
