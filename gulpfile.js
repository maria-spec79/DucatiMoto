const {src, dest, watch, series} = require ('gulp');
const sass = require ('gulp-sass');
const spritesmith = require ('gulp.spritesmith');
const imagemin = require ('gulp-imagemin');
const htmlmin = require ('gulp-htmlmin');
const csso = require ('gulp-csso');

function copyfiles() {
	return src('src/icons/*.*')
	.pipe(dest('dist/icons'));
}
exports.copyfiles = copyfiles;

function optimages() {
	return src('src/images/*.png')
	.pipe(imagemin())
	.pipe(dest('dist/images'));
}
exports.optimages = optimages;

function sprite() {
   	let spriteData = src('dist/images/*.png')
    .pipe(spritesmith({
    	imgName: 'bike_sprite.png',
    	imgPath: '../images/bike_sprite.png',
        cssName: 'bike_sprite.css',
        algorithm: "left-right",
        padding: 5
        }));

	let stylStream = spriteData.img.pipe(dest('dist/images'));
	let imgStream = spriteData.css.pipe(dest('dist/styles'));
	return (imgStream, stylStream);
};
exports.sprite = sprite;

function opthtml() {
	return src('src/*.html')
	.pipe(htmlmin({
		collapseWhitespace: true,
    	removeComments: true
	}))
	.pipe(dest('dist'));
}
exports.opthtml = opthtml;

function optcss() {
	return src('src/styles/*.css')
	.pipe(csso())
	.pipe(dest('dist/styles'));
}
exports.optcss = optcss;

function compile() {
	return src('src/styles/*.sass')
	.pipe(sass())
	.pipe(csso())
	.pipe(dest('dist/styles'));
}
exports.compile = compile;

function watchfiles(){
	watch(['src/images/*.png'], series(optimages, sprite));
	watch(['src/styles/*.css'], optcss);
	watch(['src/*.html'], opthtml);
	watch(['src/styles/*.sass'], compile);
}
exports.default = watchfiles;
