// Super backing shade (Ep1). ChatCut pixel-effect for the COLOUR 2 track. Soft dark gradient bands top and bottom for super readability.
// Current rule (27 Sep 2026): NOT used. Henry wants the original camera colour, no bands. Kept here in case a future episode needs it.
// Props: topHeight 0.2, topDarkness 0.12, bottomHeight 0.22, bottomDarkness 0.15, softness 0.8, tintColor #1A140F. Turn a band off by setting its darkness to 0.
class ReadabilityGradientEffect extends EffectProcessor {
  async initialize(ctx: EffectInitContext): Promise<void> {
    ctx.compileShader({
      id: "readability_gradient",
      fragmentShader: `#version 300 es
      precision highp float;

      uniform sampler2D u_input;
      uniform float u_topHeight;
      uniform float u_topDarkness;
      uniform float u_bottomHeight;
      uniform float u_bottomDarkness;
      uniform float u_softness;
      uniform vec3 u_tintColor;

      in vec2 v_texCoord;
      out vec4 fragColor;

      void main() {
        vec4 color = texture(u_input, v_texCoord);

        // Bottom gradient (y from 0 to bottomHeight)
        // Subtract a tiny epsilon to prevent smoothstep edges from being identical when softness is 0
        float bottomFadeStart = u_bottomHeight * (1.0 - u_softness) - 0.0001;
        float bottomBlend = 1.0 - smoothstep(bottomFadeStart, u_bottomHeight, v_texCoord.y);
        if (u_bottomHeight <= 0.0) bottomBlend = 0.0;

        // Top gradient (y from 1.0 down to 1.0 - topHeight)
        float topFadeStart = 1.0 - u_topHeight * (1.0 - u_softness) + 0.0001;
        float topBlend = smoothstep(1.0 - u_topHeight, topFadeStart, v_texCoord.y);
        if (u_topHeight <= 0.0) topBlend = 0.0;

        // Combine gradients, clamping to max 1.0 in case they overlap in the middle
        float totalMix = clamp(topBlend * u_topDarkness + bottomBlend * u_bottomDarkness, 0.0, 1.0);

        // Blend the video color towards the tint color preserving the original alpha
        fragColor = vec4(mix(color.rgb, u_tintColor, totalMix), color.a);
      }`
    });
  }

  private hexToRgb(hex: string): [number, number, number] {
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
    return [r, g, b];
  }

  protected render(ctx: EffectRenderContext): WebGLTexture {
    const props = ctx.properties || {};

    const topHeight = props.topHeight !== undefined ? Number(props.topHeight) : 0.28;
    const topDarkness = props.topDarkness !== undefined ? Number(props.topDarkness) : 0.35;
    const bottomHeight = props.bottomHeight !== undefined ? Number(props.bottomHeight) : 0.30;
    const bottomDarkness = props.bottomDarkness !== undefined ? Number(props.bottomDarkness) : 0.40;
    const softness = props.softness !== undefined ? Number(props.softness) : 0.70;
    const tintColorStr = typeof props.tintColor === 'string' ? props.tintColor : "#1A140F";

    return ctx.renderPass({
      id: "readability_gradient",
      textures: { u_input: ctx.inputTexture },
      uniforms: {
        u_topHeight: topHeight,
        u_topDarkness: topDarkness,
        u_bottomHeight: bottomHeight,
        u_bottomDarkness: bottomDarkness,
        u_softness: softness,
        u_tintColor: this.hexToRgb(tintColorStr)
      }
    });
  }
}
