#!/usr/bin/env python3
"""Download a short-form video and have Gemini watch + audit it.
Model selection is dynamic: newest available Gemini model that supports generateContent,
preferring pro > flash, so the pipeline survives model retirements.
"""
import argparse, json, os, re, sys, time
import requests
from google import genai

PROMPT = """You are a short-form content strategist auditing whether this creator knows what they are doing.
Creator: {user}. Caption: {caption}. Stats: {plays} plays, {likes} likes, {comments} comments. Duration {dur}s.
Return, tersely, in markdown:
1. Verbatim transcript with timestamps.
2. Beat sheet: for hook (0-3s), body, CTA -> spoken line, on-screen text, b-roll/visual.
3. Hook technique, clarity /10, promise made.
4. Structure format, cuts per 10s (estimate), retention devices.
5. Delivery: framing, lighting, audio, energy, eye contact.
6. CTA type + mechanics (comment gate / DM automation?), does the lead magnet match the promise?
7. Verdict: score /10, 3 strongest moves, 3 weaknesses, 1 thing to steal. Only claim what is seen/heard."""

def pick_model(client, prefer=("pro", "flash")):
    models = []
    for m in client.models.list():
        name = m.name.split("/")[-1]
        acts = getattr(m, "supported_actions", None) or []
        if not name.startswith("gemini-") or (acts and "generateContent" not in acts):
            continue
        if re.search(r"(tts|image|audio|live|embedding|exp|robotics|computer|customtools|latest|\d{3,}$)", name):
            continue
        ver = re.search(r"gemini-(\d+(?:\.\d+)?)", name)
        models.append((float(ver.group(1)) if ver else 0, name))
    for tier in prefer:
        c = sorted([m for m in models if tier in m[1] and "lite" not in m[1]], reverse=True)
        if c:
            return c[0][1]
    return sorted(models, reverse=True)[0][1]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video-url"); ap.add_argument("--file")
    ap.add_argument("--meta", help="json with ownerUsername, caption, videoPlayCount, likesCount, commentsCount, videoDuration")
    ap.add_argument("--out", default="report.md"); ap.add_argument("--model")
    ap.add_argument("--list-models", action="store_true")
    a = ap.parse_args()
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    if a.list_models:
        print(pick_model(client)); return
    path = a.file
    if not path:
        path = "reel.mp4"
        r = requests.get(a.video_url, timeout=180); r.raise_for_status()
        open(path, "wb").write(r.content)
    meta = json.load(open(a.meta)) if a.meta else {}
    prompt = PROMPT.format(user=meta.get("ownerUsername", "?"), caption=meta.get("caption", ""),
                           plays=meta.get("videoPlayCount"), likes=meta.get("likesCount"),
                           comments=meta.get("commentsCount"), dur=round(meta.get("videoDuration") or 0))
    f = client.files.upload(file=path)
    while f.state.name == "PROCESSING":
        time.sleep(2); f = client.files.get(name=f.name)
    model = a.model or pick_model(client)
    resp = client.models.generate_content(model=model, contents=[f, prompt])
    open(a.out, "w").write(f"<!-- model: {model} -->\n" + resp.text)
    print(f"model={model}\n{resp.text}")

if __name__ == "__main__":
    main()
