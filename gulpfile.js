var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var beautify = require('gulp-jsbeautify');
var rename = require('gulp-rename');
var haml = require('gulp-haml');
var loopbackAngular = require('gulp-loopback-sdk-angular');
var browserify = require('gulp-browserify');

gulp.task('lint', function() {
  gulp.src('./app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('views', function() {
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('dist/'));
});

gulp.task('beautify', function() {
  gulp.src('app/modules/**/*.js')
  .pipe(beautify({
    indent_size:2
  }))
  .pipe(gulp.dest('app/modules/'));
});

gulp.task('css', function() {
  gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
  .pipe(gulp.dest('dist/css'));
});

gulp.task('lbservice', function() {
  return gulp.src('./server/server.js')
  .pipe(loopbackAngular())
  .pipe(rename('lb-services.js'))
  .pipe(gulp.dest('./app/js'));
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

gulp.task('default', ['views','browserify','haml']);
