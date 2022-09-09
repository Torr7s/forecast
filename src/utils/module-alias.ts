import * as path from 'node:path';
import moduleAlias from 'module-alias';

const files: string = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test')
})
