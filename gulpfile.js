// Variables
var server = {
    host: 'localhost',
    port: '8001',
    https: false
}

// Global Packages
var gulp = require('gulp');

// Stylesheet Packages
var sass = require('gulp-sass');

// Webserver packages
var webserver = require('gulp-webserver');

// Stylesheet Tasks
gulp.task('sass-dev', function () {
    return gulp.src([
        './static/scss/*.scss',
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./static/css'));
});

// Webserver Tasks
gulp.task('webserver', function() {
    gulp.src( '.' )
      .pipe(webserver({
        host:             server.host,
        port:             server.port,
        https:            server.https,
        directoryListing: false
      }));
  });

// Watch Tasks
gulp.task('watch', function () {
    gulp.watch('./static/scss/**/*.scss', ['sass-dev']);    
});

//Default task
gulp.task('default', ['dev','webserver','watch']);
gulp.task('dev',['sass-dev']);

