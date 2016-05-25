// Include gulp
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sass = require('gulp-ruby-sass');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var concatCss = require('gulp-concat-css');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var nunjucks = require('gulp-nunjucks');
var gulpIgnore = require('gulp-ignore');

// Debug or not
var debug = false;

gulp.task('enableDebug', function() {
  debug = true;
});

gulp.task('disableDebug', function() {
  debug = false;
});

// Copying static files to dist folder
gulp.task('static', function() {
  gulp.src(['src/public/**/*'])
    .pipe(gulp.dest('dist/public'));
  gulp.src(['src/root/**/*'])
    .pipe(gulp.dest('dist'));
});

// Nunjucks (templating)
gulp.task('nunjucks', function() {
	gulp.src('src/views/*.njk')
    .pipe(gulpIgnore('_*'))
		.pipe(nunjucks.compile())
    .pipe(rename(function (path) {
        path.extname = ".html";
      }))
		.pipe(gulp.dest('dist'));
});

// JS hint
gulp.task('jshint', function() {
  gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Concatenate JS Files
gulp.task('scriptsDebug', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist/js'));
});

// Concatenate & minify JS Files
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      // .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// Concatenate CSS
gulp.task('cssDebug', function () {
  return gulp.src('src/css/*.css')
    .pipe(concatCss("vendor.css"))
    .pipe(gulp.dest('dist/css/'));
});

// Concatenate & minify CSS
gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    // .pipe(sourcemaps.init())
      .pipe(rename({suffix: '.min'}))
      .pipe(cssnano())
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css/'));
});

// // Map CSS
// gulp.task('cssMaps', function () {
//   return gulp.src('src/css/*.css')
//     .pipe(sourcemaps.init())
//     .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('dist/css/'));
// });

// Compile SCSS
gulp.task('sass', function() {
    return sass('src/scss/app.scss', {style: 'compressed'})
          .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions']}) ], { syntax: scss }))
          .pipe(rename({suffix: '.min'}))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

// Optimise images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'));
});

// Watch Task
gulp.task('watch', function() {
  // Watch static files
  gulp.watch(['src/public/**/*', 'src/root/**/*'], ['static']);
  // Watch .html files
  gulp.watch('src/views/*.njk', ['nunjucks']);
  // Watch .js files
  gulp.watch('src/js/*.js', ['jshint', 'scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass']);
  // Watch .css files
  gulp.watch('src/css/*.css', ['css']);
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
});

// Production Task
gulp.task('default', ['static', 'nunjucks', 'jshint', 'scripts', 'css', 'sass', 'images', 'watch']);

// Dev Task
gulp.task('debug', ['enableDebug', 'default']);
