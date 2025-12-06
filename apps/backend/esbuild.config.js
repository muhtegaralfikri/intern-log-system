const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./dist/src/main.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: './dist/bundle.js',
  external: [
    '@prisma/client',
    '@nestjs/microservices',
    '@nestjs/websockets',
    'class-transformer',
    'class-validator',
    'bcrypt',
  ],
  minify: true,
  sourcemap: false,
}).then(() => {
  console.log('Bundle created successfully!');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
