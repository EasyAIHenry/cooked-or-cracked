# Vox Explainer — studio project (Henry Chua's version)

This folder is a self-contained studio for making narrated motion-graphics
explainer videos in the Vox style, driven entirely by the `vox-explainer`
skill in `.claude/skills/`.

When the user greets you, asks to start, or says anything about making a
video — invoke the `vox-explainer` skill and follow its staged flow
exactly: welcome → topic → settings → voice → brief → style key → scenes →
clips → cut. One stage per message; wait between stages.

Presentation matters here as much as function: follow the skill's Global
UI rules in every message (tables, dividers, no internal/technical
chatter, clean pasteable blocks).

State lives on disk: each video is a folder under `projects/` (pack.md,
clips/, voice/, final.mp4). `EXPLAINER.md` is the one-page intro the user
received with this folder.

This studio writes prompts and generates local audio. Paid generations
run only through a connector the user has set up (for example the
Higgsfield connector) and only after the user asks; ask before each call
and say what it costs in credits. Without a connector, the user runs the
prompts in their own generator and brings the clips back.
