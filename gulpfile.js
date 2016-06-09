// Include gulp
var gulp = require('gulp');

// Include plugins
var gulpif = require('gulp-if');
var watch = require('gulp-watch');
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
var mainBowerFiles = require('main-bower-files');
var clean = require('gulp-clean');
var jasmineBrowser = require('gulp-jasmine-browser');

// Debug or not
var debug = false;

gulp.task('enableDebug', function() {
  debug = true;
});

gulp.task('disableDebug', function() {
  debug = false;
});

// Cleaning 'dist' folder
gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

// Copying static files to dist folder
gulp.task('static', function() {
  gulp.src(['src/public/vendor/*'])
    .pipe(gulp.dest('dist/public/vendor'));
  gulp.src(['src/root/**/*'])
    .pipe(gulp.dest('dist'));
});

// Bower components
gulp.task('bower', function() {
  return gulp.src(mainBowerFiles(), { base: 'src/public/components' })
    .pipe(gulp.dest('dist/public/components'));
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
		.pipe(gulpif(debug, jshint()))
		.pipe(gulpif(debug, jshint.reporter('jshint-stylish')));
});

// Concatenate & minify JS Files
gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(concat('app.js'))
			.pipe(gulpif(!debug, uglify()))
      .pipe(gulp.dest('dist/js'));
});

// Concatenate & minify CSS
gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    // .pipe(sourcemaps.init())
      .pipe(rename({suffix: '.min'}))
			.pipe(gulpif(!debug, cssnano()))
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css/'));
});

// Compile SCSS
gulp.task('sass', function() {
	var minify = debug ? null : { style: 'compressed' };
  return sass('src/scss/app.scss', minify)
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

// JS unit testing
gulp.task('jasmine', function() {
	var sourceFiles = ['src/public/vendor/modernizr-2.8.3.min.js',
										 'src/public/components/jquery/dist/jquery.min.js',
										 'src/public/components/underscore/underscore-min.js',
										 'src/public/components/moment/min/moment.min.js',
										 'src/public/components/knockout/dist/knockout.js',
										 'src/public/components/EaselJS/lib/easeljs-0.8.2.combined.js',
										 'src/js/**/*.js', 'src/spec/**/*.js'];
	gulp.src(sourceFiles)
		.pipe(watch(sourceFiles))
		.pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

// Watch Task
gulp.task('watch', function() {
  // Watch static files
  gulp.watch(['src/public/**/*', 'src/root/**/*'], ['static']);
  // Watch .html files
  gulp.watch('src/views/*.njk', ['nunjucks']);
  // Watch .js files
  gulp.watch('src/js/**/*.js', ['jshint', 'scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass']);
  // Watch .css files
  gulp.watch('src/css/*.css', ['css']);
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
});

// Default Task
gulp.task('default', ['static', 'bower', 'nunjucks', 'jshint', 'scripts', 'css', 'sass', 'images']);

// Development Task
gulp.task('dev', ['enableDebug', 'default', 'watch']);

// Production Task
gulp.task('prod', ['disableDebug', 'default']);
