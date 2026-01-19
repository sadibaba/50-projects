    const colorInput = document.getElementById('colorInput');
    const hexInput = document.getElementById('hexInput');
    const rgbOutput = document.getElementById('rgbOutput');
    const hslOutput = document.getElementById('hslOutput');
    const preview = document.getElementById('preview');
    const contrastNote = document.getElementById('contrastNote');
    const copyHexBtn = document.getElementById('copyHex');
    const copyRgbBtn = document.getElementById('copyRgb');
    const copyHslBtn = document.getElementById('copyHsl');

    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

    function hexToRgb(hex) {
      hex = hex.trim();
      if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) return null;
      if (hex.length === 4) {
        hex = '#' + [...hex.slice(1)].map(c => c + c).join('');
      }
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    }

    function rgbToHex(r, g, b) {
      const toHex = v => v.toString(16).padStart(2, '0');
      return '#' + toHex(clamp(r, 0, 255)) + toHex(clamp(g, 0, 255)) + toHex(clamp(b, 0, 255));
    }

    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          default: h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }

    function getRelativeLuminance({ r, g, b }) {
      const srgb = [r, g, b].map(v => v / 255);
      const lin = srgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
    }

    function contrastRatio(hex) {
      const rgb = hexToRgb(hex);
      if (!rgb) return null;
      const L1 = getRelativeLuminance(rgb);
      const L2 = getRelativeLuminance({ r: 255, g: 255, b: 255 }); // white
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      return ratio;
    }

    function updateUIFromHex(hex) {
      const rgb = hexToRgb(hex);
      if (!rgb) return;
      const { r, g, b } = rgb;
      const hsl = rgbToHsl(r, g, b);

      preview.style.backgroundColor = hex;
      rgbOutput.value = `rgb(${r}, ${g}, ${b})`;
      hslOutput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

      const ratio = contrastRatio(hex);
      if (ratio !== null) {
        const okAA = ratio >= 4.5;
        contrastNote.textContent = `Contrast vs white: ${ratio.toFixed(2)} ${okAA ? '(WCAG AA readable for normal text)' : '(low contrast for normal text)'}`
      } else {
        contrastNote.textContent = '';
      }
    }

    colorInput.addEventListener('input', () => {
      hexInput.value = colorInput.value;
      updateUIFromHex(colorInput.value);
    });

    hexInput.addEventListener('input', () => {
      const val = hexInput.value.toLowerCase();
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(val)) {
        colorInput.value = val.length === 4
          ? '#' + [...val.slice(1)].map(c => c + c).join('')
          : val;
        updateUIFromHex(colorInput.value);
      }
    });

    async function copyText(el, btn) {
      try {
        await navigator.clipboard.writeText(el.value);
        const old = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = old), 1200);
      } catch {
        alert('Copy failed. Try manually selecting and copying.');
      }
    }
    copyHexBtn.addEventListener('click', () => copyText(hexInput, copyHexBtn));
    copyRgbBtn.addEventListener('click', () => copyText(rgbOutput, copyRgbBtn));
    copyHslBtn.addEventListener('click', () => copyText(hslOutput, copyHslBtn));

    updateUIFromHex(hexInput.value);