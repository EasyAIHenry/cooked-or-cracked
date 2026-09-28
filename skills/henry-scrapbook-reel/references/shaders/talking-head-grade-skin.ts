// Talking head grade + skin + highlight roll-off. ChatCut pixel-effect (WebGL2 fragment shader). Sits on the COLOUR 1 track under all supers.
// Current rule (27 Sep 2026): NO grade. Only skin smoothing stays on. Set exposure 0, contrast 1, saturation 1, warmth 0, liftShadows 0,
// vignetteStrength 0, highlightRolloff 0, and keep skinSmooth 0.55, skinRadius 2, skinGlow 0.06. The defaults below are the old Ep1 grade.
// Props: exposure 0.22, contrast 1.04, saturation 1.15, warmth 0.1, liftShadows 0.05, vignetteStrength 0.1, vignetteSoftness 0.7,
//        skinSmooth 0.55, skinRadius 2, skinGlow 0.06, highlightKnee 0.7, highlightRolloff 0.8
// Create with submit_shader, then edit_asset with { code, properties, name }. Updates to a placed effect need type "pixel-effect" and the full id.
class TalkingHeadGradeSkinEffect extends EffectProcessor {
  async initialize(ctx: EffectInitContext): Promise<void> {
    ctx.compileShader({
      id: "talkingHeadGradeSkin",
      fragmentShader: `#version 300 es
      precision highp float;

      uniform sampler2D u_input;
      uniform float u_exposure;
      uniform float u_contrast;
      uniform float u_saturation;
      uniform float u_warmth;
      uniform float u_liftShadows;
      uniform float u_vignetteStrength;
      uniform float u_vignetteSoftness;
      uniform float u_skinSmooth;
      uniform float u_skinRadius;
      uniform float u_skinGlow;
      uniform float u_highlightKnee;
      uniform float u_highlightRolloff;

      in vec2 v_texCoord;
      out vec4 fragColor;

      // Skin likelihood from YCbCr chroma (works across skin tones, rejects walls/wood/shirt)
      float skinMask(vec3 c) {
        float y  = dot(c, vec3(0.299, 0.587, 0.114));
        float cb = 0.5 + dot(c, vec3(-0.168736, -0.331264, 0.5));
        float cr = 0.5 + dot(c, vec3(0.5, -0.418688, -0.081312));
        float mCr = smoothstep(0.52, 0.56, cr) * (1.0 - smoothstep(0.66, 0.70, cr));
        float mCb = smoothstep(0.34, 0.37, cb) * (1.0 - smoothstep(0.49, 0.52, cb));
        float mY  = smoothstep(0.15, 0.25, y);
        return mCr * mCb * mY;
      }

      void main() {
        vec4 texColor = texture(u_input, v_texCoord);
        vec3 src = texColor.rgb;

        // 0. Skin smoothing: edge-aware (bilateral) blur, only on skin
        vec2 texel = 1.0 / vec2(textureSize(u_input, 0));
        float m = skinMask(src);
        vec3 color = src;
        if (u_skinSmooth > 0.0 && m > 0.01) {
          vec3 acc = vec3(0.0);
          float wsum = 0.0;
          for (int i = -3; i <= 3; i++) {
            for (int j = -3; j <= 3; j++) {
              vec2 off = vec2(float(i), float(j)) * texel * u_skinRadius;
              vec3 s = texture(u_input, v_texCoord + off).rgb;
              float d = length(s - src);
              float w = exp(-d * d * 60.0) * exp(-float(i * i + j * j) / 8.0);
              acc += s * w;
              wsum += w;
            }
          }
          vec3 smoothC = acc / max(wsum, 1e-4);
          color = mix(src, smoothC, clamp(u_skinSmooth * m, 0.0, 1.0));
          // gentle healthy lift on skin only
          color += u_skinGlow * m * (1.0 - color) * 0.5;
        }

        // 1. Exposure
        color *= pow(2.0, u_exposure);
        // 2. Contrast around mid-grey
        color = (color - 0.5) * u_contrast + 0.5;
        // 3. Saturation (Rec.709 luma)
        float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
        color = mix(vec3(luma), color, u_saturation);
        // 4. Warmth
        color *= vec3(1.0 + u_warmth * 0.15, 1.0 + u_warmth * 0.05, 1.0 - u_warmth * 0.15);
        // 5. Lift shadows
        color = color + u_liftShadows * (1.0 - clamp(color, 0.0, 1.0));
        // 5b. Highlight roll-off (keeps white shirt from blowing out; skin excluded)
        float hl = dot(color, vec3(0.2126, 0.7152, 0.0722));
        if (u_highlightRolloff > 0.0 && hl > u_highlightKnee) {
          float t = (hl - u_highlightKnee) / (1.0 - u_highlightKnee);
          float hlNew = u_highlightKnee + (1.0 - u_highlightKnee) * t / (1.0 + u_highlightRolloff * t);
          float amt = 1.0 - 0.85 * m;
          color *= mix(1.0, hlNew / hl, amt);
        }
        // 6. Vignette
        vec2 uv = v_texCoord - 0.5;
        float dist = length(uv);
        float outerRadius = 0.707;
        float innerRadius = outerRadius * (1.0 - u_vignetteSoftness);
        float vig = smoothstep(outerRadius, innerRadius, dist);
        color *= mix(1.0 - u_vignetteStrength, 1.0, vig);

        fragColor = vec4(clamp(color, 0.0, 1.0), texColor.a);
      }`
    });
  }

  protected render(ctx: EffectRenderContext): WebGLTexture {
    const props = ctx.properties || {};
    const n = (k: string, d: number) => (typeof props[k] === "number" ? props[k] : d);
    return ctx.renderPass({
      id: "talkingHeadGradeSkin",
      textures: { u_input: ctx.inputTexture },
      uniforms: {
        u_exposure: n("exposure", 0.22),
        u_contrast: n("contrast", 1.04),
        u_saturation: n("saturation", 1.15),
        u_warmth: n("warmth", 0.1),
        u_liftShadows: n("liftShadows", 0.05),
        u_vignetteStrength: n("vignetteStrength", 0.1),
        u_vignetteSoftness: n("vignetteSoftness", 0.7),
        u_skinSmooth: n("skinSmooth", 0.55),
        u_skinRadius: n("skinRadius", 2.0),
        u_skinGlow: n("skinGlow", 0.06),
        u_highlightKnee: n("highlightKnee", 0.7),
        u_highlightRolloff: n("highlightRolloff", 0.8)
      }
    });
  }
}
