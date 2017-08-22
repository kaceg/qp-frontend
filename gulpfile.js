// Global Packages
var gulp = require('gulp');

// Stylesheet Packages
var sass = require('gulp-sass');

// Stylesheet Tasks
gulp.task('sass-dev', function () {
    return gulp.src([
        './static/scss/*.scss',
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./static/css'));
});

// Watch Tasks
gulp.task('watch', function () {
    gulp.watch('./static/scss/**/*.scss', ['sass-dev']);    
});

//Default task
gulp.task('default', ['sass-dev']);

