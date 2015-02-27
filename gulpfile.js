var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var haml = require('gulp-haml');
var browserify = require('gulp-browserify');

gulp.task('lint', function() {
  gulp.src('./app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('views', function() {
  gulp.src('app/index.html')
  .pipe(gulp.dest('dist/'));
});

gulp.task('css', function() {
  gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
  .pipe(gulp.dest('dist/css'));
});

gulp.task('browserify', function() {
  gulp.src(['app/app.js'])
  .pipe(browserify({debug:true}))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('dist/js'));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('haml', function() {
  gulp.src('./app/**/*.haml')
  .pipe(haml())
  .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['views','bower','css','browserify']);
