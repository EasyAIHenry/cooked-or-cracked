# Unprimed verbatim listen of the finished edit (series rule): find clipped or cut-off words at the joins.
import os, sys, subprocess
from google import genai
from google.genai import types
src = sys.argv[1]
subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-vn","-ac","1","-ar","16000","/tmp/p2_listen.wav"],check=True)
c = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
prompt = ("Transcribe this audio verbatim with timestamps (mm:ss.s) at every sentence. Include fillers and partial words. "
          "Then list every place where a word sounds cut off, clipped at its start or end, or where two words are joined unnaturally, "
          "with the timestamp. Also list any sound effect that is louder than the voice.")
r = c.models.generate_content(model="gemini-3.1-pro-preview", contents=[prompt, types.Part.from_bytes(data=open("/tmp/p2_listen.wav","rb").read(), mime_type="audio/wav")])
print(r.text)
