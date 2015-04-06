var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

gulp.task('min-css', function() {
  gulp.src('./public/css/myStyle.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css/'))
});

gulp.task('min-js', function() {
  gulp.src('./public/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/'))
});

gulp.task('default', ['min-css', 'min-js']);