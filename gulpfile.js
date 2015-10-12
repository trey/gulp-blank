var browserSync = require('browser-sync').create();
var changed = require('gulp-changed');
var connect = require('gulp-connect');
var del = require('del');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var stylelint = require('stylelint');

var paths = {
    index: ['src/index.html'],
    scripts: ['src/static/js/**/*'],
    images: ['src/static/img/**/*'],
    styles: ['src/static/css/**/*']
}

gulp.task('connect', function() {
    connect.server({
        root: 'dist'
    });
});

gulp.task('copy', function() {
    return gulp.src(paths.index)
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    return gulp.src(paths.styles)
        .pipe(postcss([
            stylelint({
                'indentation': [2, 'tab']
            }),
            require('autoprefixer'),
            require('postcss-simple-vars')
        ]))
        .pipe(gulp.dest('dist/static/css'))
        .pipe(browserSync.stream());
})

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'localhost:8080',
        open: false
    })
});

gulp.task('watch', function() {
    gulp.watch(paths.index, ['copy']).on('change', browserSync.reload);
    gulp.watch(paths.styles, ['css']);
});

gulp.task('default', ['copy', 'css', 'connect', 'browser-sync', 'watch']);
