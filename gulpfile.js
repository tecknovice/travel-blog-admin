const path = require('path')
const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const source = path.join(__dirname, 'public', 'temp' ,'images', '*')
const dest = path.join(__dirname, 'public', 'images')
const globby = require('globby')
const del = require('del')

// Array.prototype.diff = function (a) {
//     return this.filter(function (i) { return a.indexOf(i) < 0; });
// };

// async function imageclean() {

//     let sourceFiles = await globby(source)
//     sourceFiles = sourceFiles.map(file => file.match(/[^/]+$/)[0])
//     let destFiles = await globby(dest)
//     destFiles = destFiles.map(file => file.match(/[^/]+$/)[0])

//     let deleteFiles = destFiles.diff(sourceFiles)
//     deleteFiles = deleteFiles.map(file => path.join(dest, file))
//     const deletedPaths = await del(deleteFiles)

// }

async function imageclean() {
    let deleteFiles = await globby(source)
    await del(deleteFiles)
}
function imageminify() {
    return gulp.src(source)
        .pipe(imagemin([
            imagemin.jpegtran({
                progressive: true
            }),
            imageminMozjpeg()
        ]))
        .pipe(gulp.dest(dest));
}
gulp.task("imageminify", imageminify)
gulp.task("imageclean", imageclean)
gulp.task("watch", () => {
    gulp.watch(source, gulp.series('imageminify', 'imageclean'));
})
gulp.task("default", gulp.series("imageminify", 'imageclean', "watch"))