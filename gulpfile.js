// Variables
var server = {
    host: 'localhost',
    port: '8001',
    https: false
}

var fontName = 'qp-icons';
var fontCssClass = "qp-icon";

// Global Packages
var gulp = require('gulp');
var rename = require('gulp-rename');

// Stylesheet Packages
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// Iconfont Packages
var imagemin = require('gulp-imagemin');
var iconfont = require('gulp-iconfont');
var iconfontcss = require('gulp-iconfont-css');

// Webserver packages
var browserSync = require('browser-sync').create();

// Stylesheet Tasks
gulp.task('sass-dev', function () {
    return gulp.src([
        './static/scss/*.scss',
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./static/css/cache')) 
});

// Post CSS Task
gulp.task('post-css',['sass-dev'], function () {
    return gulp.src([
        './static/css/cache/*.css',
      ])
      .pipe(postcss([ autoprefixer() ]))
      .pipe(gulp.dest('./static/css'))
      .pipe(browserSync.stream());      
});

// Iconfont tasks
gulp.task('iconfont',['imagemin'], function() {
    gulp.src(['./static/assets/svg/font/*.svg'])
        .pipe(iconfontcss({
            fontName: fontName,
            targetPath: '../../scss/PUB/_Icons.scss',
            fontPath: '../../static/assets/fonts/',
            cssClass: fontCssClass
        }))
        .pipe(iconfont({
            fontName: fontName,
            // Remove woff2 if you get an ext error on compile
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            normalize: true,
            fontHeight: 1001
        }))
    .pipe(gulp.dest('./static/assets/fonts/'))
});

gulp.task('imagemin', function(){
    gulp.src('./static/assets/svg/font/*.svg')
        .pipe(imagemin())
        .pipe(gulp.dest('./static/assets/svg/font/'))
});


// Watch Tasks
gulp.task('watch',['iconfont','post-css'], function () {
    browserSync.init({
        server: "."
    });
    gulp.watch('./static/scss/**/*.scss', ['post-css']);
    gulp.watch("./**/*.html").on('change', browserSync.reload);
    gulp.watch('./static/assets/svg/font/*.svg', ['iconfont']);
});

//Default task
gulp.task('default', ['watch']);
