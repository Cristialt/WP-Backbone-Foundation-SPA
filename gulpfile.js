/*jslint node: true */
"use strict";

var $           = require('gulp-load-plugins')();
var argv        = require('yargs').argv;
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var merge       = require('merge-stream');
var sequence    = require('run-sequence');
var colors      = require('colors');
var dateFormat  = require('dateformat');
var del         = require('del');

// Enter URL of your local server here
// Example: 'http://localwebsite.dev'
var URL = '';

// Check for --production flag
var isProduction = !!(argv.production);

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  sass: [
    'assets/components/foundation-sites/scss',
    'assets/components/motion-ui/src',
    'assets/components/fontawesome/scss'
  ],
  javascript: [
    ///////////////////////////////////////////////////////////////
    // Note that the main libs, jQuery, Underscore and Backbone
    // are loaded by Wordpress and the REST api respectively

    // jQuery
    // 'assets/components/jquery/dist/jquery.js',

    //  What Input
    'assets/components/what-input/what-input.js',

    // Foundation
    'assets/components/foundation-sites/js/foundation.core.js',
    'assets/components/foundation-sites/js/foundation.util.*.js',

    // Paths to individual Foundation JS components defined below
    'assets/components/foundation-sites/js/foundation.abide.js',
    'assets/components/foundation-sites/js/foundation.accordion.js',
    'assets/components/foundation-sites/js/foundation.accordionMenu.js',
    'assets/components/foundation-sites/js/foundation.drilldown.js',
    'assets/components/foundation-sites/js/foundation.dropdown.js',
    'assets/components/foundation-sites/js/foundation.dropdownMenu.js',
    'assets/components/foundation-sites/js/foundation.equalizer.js',
    'assets/components/foundation-sites/js/foundation.interchange.js',
    'assets/components/foundation-sites/js/foundation.magellan.js',
    'assets/components/foundation-sites/js/foundation.offcanvas.js',
    'assets/components/foundation-sites/js/foundation.orbit.js',
    'assets/components/foundation-sites/js/foundation.responsiveMenu.js',
    'assets/components/foundation-sites/js/foundation.responsiveToggle.js',
    'assets/components/foundation-sites/js/foundation.reveal.js',
    'assets/components/foundation-sites/js/foundation.slider.js',
    'assets/components/foundation-sites/js/foundation.sticky.js',
    'assets/components/foundation-sites/js/foundation.tabs.js',
    'assets/components/foundation-sites/js/foundation.toggler.js',
    'assets/components/foundation-sites/js/foundation.tooltip.js',

    // Motion UI
    'assets/components/motion-ui/dist/motion-ui.js',

    // What Input
    'assets/components/what-input/what-input.js',

    // Underscore & Backbone
    // 'assets/components/underscore/underscore.js',
    // 'assets/components/backbone/backbone.js',
    'assets/components/backbone.localstorage/backbone.localstorage.js'

    // Include own custom script
    // ,'assets/javascript/spa.js'
  ],
  phpcs: [
    '**/*.php',
    '!wpcs',
    '!wpcs/**'
  ],
  pkg: [
    '**/*',
    '!**/node_modules/**',
    '!**/components/**',
    '!**/scss/**',
    '!**/bower.json',
    '!**/package.json',
    '!**/codesniffer.ruleset.xml',
    '!**/packaged/*'
  ]
};

// Browsersync task
gulp.task('browser-sync', ['build'], function() {
  var files = [
    '**/*.php',
    '**/*.js',
    '**/*.scss',
    'assets/images/**/*.{png,jpg,gif}'
  ];

  browserSync.init(files, { proxy: URL});
});

// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function() {
  // Minify CSS if run wtih --production flag
  var minifycss = $.if(isProduction, $.minifyCss());

  return gulp.src('assets/scss/app.scss')
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        includePaths: PATHS.sass
      }))
      .on('error', $.notify.onError({
        message: "<%= error.message %>",
        title: "Sass Error"
      }))
      .pipe($.autoprefixer({
        browsers: COMPATIBILITY
      }))
      .pipe(minifycss)
      .pipe($.if(!isProduction, $.sourcemaps.write('.')))
      .pipe(gulp.dest('assets/stylesheets'))
      .pipe(browserSync.stream({match: '**/*.css'}));
});

// Lint all JS files in custom directory
gulp.task('lint', function() {
  return gulp.src('assets/javascript/custom/*.js')
      .pipe($.jshint())
      .pipe($.notify(function (file) {
        if (file.jshint.success) {
          return false;
        }

        var errors = file.jshint.results.map(function (data) {
          if (data.error) {
            return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
          }
        }).join("\n");
        return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
      }));
});

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {
  var uglify = $.uglify()
      .on('error', $.notify.onError({
        message: "<%= error.message %>",
        title: "Uglify JS Error"
      }));

  return gulp.src(PATHS.javascript)
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.concat('app.js', {
        newLine:'\n;'
      }))
      .pipe($.if(isProduction, uglify))
      .pipe($.if(!isProduction, $.sourcemaps.write()))
      .pipe(gulp.dest('assets/javascript'))
      .pipe(browserSync.stream());
});

// Copy task
gulp.task('copy', function() {
  // Motion UI
  var motionUi = gulp.src('assets/components/motion-ui/**/*.*')
      .pipe($.flatten())
      .pipe(gulp.dest('assets/javascript/vendor/motion-ui'));

  // What Input
  var whatInput = gulp.src('assets/components/what-input/**/*.*')
      .pipe($.flatten())
      .pipe(gulp.dest('assets/javascript/vendor/what-input'));

  // Font Awesome
  var fontAwesome = gulp.src('assets/components/fontawesome/fonts/**/*.*')
      .pipe(gulp.dest('assets/fonts'));

  return merge(motionUi, whatInput, fontAwesome);
});

// Package task
gulp.task('package', ['build'], function() {
  var fs = require('fs');
  var time = dateFormat(new Date(), "yyyy-mm-dd_HH-MM");
  var pkg = JSON.parse(fs.readFileSync('./package.json'));
  var title = pkg.name + '_' + time + '.zip';

  return gulp.src(PATHS.pkg)
      .pipe($.zip(title))
      .pipe(gulp.dest('packaged'));
});

// Build task
// Runs copy then runs sass & javascript in parallel
gulp.task('build', ['clean'], function(done) {
  sequence('copy',
      ['sass', 'javascript', 'lint'],
      done);
});

// PHP Code Sniffer task
gulp.task('phpcs', function() {
  return gulp.src(PATHS.phpcs)
      .pipe($.phpcs({
        bin: 'wpcs/vendor/bin/phpcs',
        standard: './codesniffer.ruleset.xml',
        showSniffCode: true,
      }))
      .pipe($.phpcs.reporter('log'));
});

// PHP Code Beautifier task
gulp.task('phpcbf', function () {
  return gulp.src(PATHS.phpcs)
      .pipe($.phpcbf({
        bin: 'wpcs/vendor/bin/phpcbf',
        standard: './codesniffer.ruleset.xml',
        warningSeverity: 0
      }))
      .on('error', $.util.log)
      .pipe(gulp.dest('.'));
});

// Clean task
gulp.task('clean', function(done) {
  sequence(['clean:javascript', 'clean:css'], done);
});

// Clean JS
gulp.task('clean:javascript', function() {
  return del([
    'assets/javascript/app.js'
  ]);
});

// Clean CSS
gulp.task('clean:css', function() {
  return del([
    'assets/stylesheets/app.css',
    'assets/stylesheets/app.css.map'
  ]);
});

// Default gulp task
// Run build task and watch for file changes
gulp.task('default', ['build', 'browser-sync'], function() {

  // Log file changes to console
  function logFileChange(event) {
    var fileName = require('path').relative(__dirname, event.path);
    console.log('[' + 'WATCH'.green + '] ' + fileName.magenta + ' was ' + event.type + ', running tasks...');

  }

  // Sass Watch
  gulp.watch(['assets/scss/**/*.scss'], ['clean:css', 'sass'])
      .on('change', function(event) {
        logFileChange(event);
      });

  // JS Watch
  gulp.watch(['gulpfile.js','assets/javascript/custom/**/*.js'], ['clean:javascript', 'javascript', 'lint'])
      .on('change', function(event) {
        logFileChange(event);
      });
});
