const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
function imgSquash() {
    return gulp.src("./public/images/*")
        .pipe(imagemin([
            imagemin.jpegtran({
                progressive: true
            }),
            imageminMozjpeg()
        ]))
        .pipe(gulp.dest("./public/gulp/images"));
}
gulp.task("imgSquash", imgSquash)
gulp.task("watch", () => {
    gulp.watch("./public/images/*", imgSquash);
})
gulp.task("default", gulp.series("imgSquash", "watch"))