const mix = require('laravel-mix');
const path = require('path');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

if (!mix.inProduction()) {
  mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app/app.scss', 'public/css');

  mix.js('resources/js/dashboard.js', 'public/js')
    .react()
    .less('resources/less/dashboard/dashboard.less', 'public/css', {
      lessOptions: {
        javascriptEnabled: true,
      },
    }).sourceMaps();
} else {
  mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app/app.scss', 'public/css');

  mix.js('resources/js/dashboard.js', 'public/js')
    .react()
    .less('resources/less/dashboard/dashboard.less', 'public/css', {
      lessOptions: {
        javascriptEnabled: true,
      },
    })
    .version();
}

mix.alias({
  '@components': path.join(__dirname, 'resources/js/components'),
  '@less': path.join(__dirname, 'resources/less'),
  '@scss': path.join(__dirname, 'resources/scss'),
});
