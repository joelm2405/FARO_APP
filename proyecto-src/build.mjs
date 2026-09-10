import { build } from 'esbuild';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const result = await build({
  absWorkingDir: fileURLToPath(new URL('.', import.meta.url)),
  entryPoints: ['main.tsx'], bundle: true, write: false, outdir: 'dist',
  minify: true, loader: { '.jpg': 'dataurl', '.ttf': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"' },
});
const js = result.outputFiles.find(f => f.path.endsWith('.js')).text;
const css = result.outputFiles.find(f => f.path.endsWith('.css')).text;
const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#175d9d" />
<title>FARO · Claridad para cada decisión</title>
<style>${css}</style></head><body><div id="root"></div>
<script>${js.replaceAll('</script', '<\\/script')}</script></body></html>`;
await writeFile(new URL('index.html', import.meta.url), html);
await writeFile(new URL('../index.html', import.meta.url), html);
await writeFile(new URL('../../index.html', import.meta.url), html);
console.log('index.html generado en la raíz del workspace, FARO-InnovaUtec/ y proyecto-src/.');
