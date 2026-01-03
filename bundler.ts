import { rm } from 'node:fs/promises'
import copyContents from './copier';

try {
  await rm('./build', { recursive: true, force: true });
} catch (error) {
  // Ignore if directory doesn't exist
  console.warn('Cannot build existing build directory.', error);
}

const result = await Bun.build({
  entrypoints: [
    // Will bundle popup script and css and chunk them
    './src/popup/popup.html',

    // Bundle scripts separately
    './src/scripts/background.ts',
    './src/scripts/content.ts'
  ],
  outdir: './build',
  minify: true,

  // Target browser for extension
  target: 'browser',
  // sourcemap: 'linked'
});

await copyContents('./public', './build');

// Report build results
if (result.success) {
  console.log('✅ Build successful!');
  console.log(`📦 ${result.outputs.length} files generated\n`);
  
  for (const output of result.outputs) {
    const size = (output.size / 1024).toFixed(2);
    console.log(`   ${output.kind.padEnd(12)} ${output.path} (${size}KB)`);
  }
} else {
  console.error('❌ Build failed!');
  throw new AggregateError(result.logs);
}