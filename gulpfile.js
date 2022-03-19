var gulp   = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('js', function (done) {
    gulp.src('src/*.js')
        .pipe(gulp.dest('dest'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dest'));
    done();
});

gulp.task('image', function (done) {
    gulp.src('src/image/*')
        .pipe(gulp.dest('dest/image'));
    done();
});

gulp.task('default', gulp.series('js', 'image'));
