// Include gulp
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var concatCss = require('gulp-concat-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

// Concatenate JS Files
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('app.js'))
      // .pipe(rename({suffix: '.min'}))
      // .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// Concatenate CSS
gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    .pipe(concatCss("vendor.css"))
    .pipe(gulp.dest('dist/css/'));
});

// Compile SCSS
gulp.task('sass', function() {
    return sass('src/scss/app.scss', {style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
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
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass']);
  // Watch .css files
  gulp.watch('src/css/*.css', ['css']);
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
});

// Default Task
gulp.task('default', ['scripts', 'css', 'sass', 'images', 'watch']);
