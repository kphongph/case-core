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

gulp.task('bootstrap_css', function() {
  gulp.src('./bower_components/bootstrap/dist/css/*')
  .pipe(gulp.dest('dist/css'));
});

gulp.task('font-awesome_css', function() {
  gulp.src('./bower_components/components-font-awesome/css/*') 
  .pipe(gulp.dest('onsen/css/font_awesome/css'));
});

gulp.task('ionicons_css', function() {
  gulp.src('./bower_components/ionicons/css/*') 
  .pipe(gulp.dest('onsen/css/ionicons/css'));
});

gulp.task('onsen_bower', function() {
  gulp.src('./bower_components/onsenui/build/**')
  .pipe(gulp.dest('onsen/lib/onsen'));
});

gulp.task('bootstrap_font', function() {
  gulp.src('./bower_components/bootstrap/dist/fonts/*')
  .pipe(gulp.dest('dist/fonts'));
});


gulp.task('lbservice', function() {
  return gulp.src('./server/server.js')
  .pipe(loopbackAngular())
  .pipe(rename('lb-services.js'))
//  .pipe(gulp.dest('./app/js'));
//  .pipe(gulp.dest('./onsen/lib'));
  .pipe(gulp.dest('./client/js'));
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

gulp.task('default', []);
gulp.task('bootstrap', ['bootstrap_css','bootstrap_font']);
gulp.task('onsenui', ['onsen_bower','font-awesome_css','ionicons_css']);

