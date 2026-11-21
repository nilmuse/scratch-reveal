import { defineCssLibrary } from '@nilmuse/tsdown-config';

export default defineCssLibrary({
  cssFileName: 'scratch-reveal.css',
  platform: 'browser',
  entry: { index: 'src/scratch-reveal.ts' },
});
