var gulp   = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['js', 'image']);

gulp.task('js', function () {
    gulp.src('src/*.js')
        .pipe(gulp.dest('dest'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dest'));
});

gulp.task('image', function () {
    gulp.src('src/image/*')
        .pipe(gulp.dest('dest/image'));
});
