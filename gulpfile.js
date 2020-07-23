const { src, dest, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const prefix = require('autoprefixer');
const postcss = require('gulp-postcss');
const watch = require('gulp-watch');
const debug = require('gulp-debug');
const csso = require('gulp-csso');
const pug = require('gulp-pug');
const sync = require('browser-sync').create();
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');


function cleanDist() {
	return src('dist', {read: false})
				.pipe(clean());
}

function toCSS() {
	return src(['dev/sass/**/*.sass', '!dev/sass/modules/**'])
				.pipe(sourcemaps.init())
				.pipe(debug({title: 'sass:'}))
				.pipe(scss())
				.pipe(postcss([prefix()]))
				.pipe(csso())
				.pipe(sourcemaps.write())
				.pipe(dest('dist/css/'));
}

function toHTML() {
	return src(['dev/pug/**/*.pug', '!dev/pug/templates/**'])
				.pipe(sourcemaps.init())
				.pipe(debug({title: 'pug:'}))
				.pipe(pug())
				.pipe(sourcemaps.write())
				.pipe(dest('dist/'));
}

function babelJS() {
	return src(['dev/js/**/*.js', '!dev/js/static/**'])
				.pipe(sourcemaps.init())
				.pipe(debug({title: 'js:'}))
				.pipe(babel({
					presets: ['@babel/env']
				}))
				.pipe(webpack({
					mode: "production",
					output: {
						filename: 'index.js'
					}
				}))
				.pipe(sourcemaps.write())
				.pipe(dest('dist/js'));
}

function copyJS() { // bad choice
	return src('dev/js/static/**/*.js')
				.pipe(sourcemaps.init())
				.pipe(debug({title: 'js:'}))
				.pipe(sourcemaps.write())
				.pipe(dest('dist/js/static'));
}

function copyStatic() {
	return src('dev/static/**/*.*', {allowEmpty: true})
				.pipe(dest('dist/static/'));
}

function watchFiles() {
	watch('dev/sass/**/*.sass', toCSS);
	watch('dev/pug/**/*.pug', toHTML);
	watch(['dev/js/**/*.js', '!dev/js/static/**'], babelJS);
	watch('dev/js/static/**/*.js', copyJS);
}

function browserSync() {
	sync.init( {
		server: {
			baseDir: "./dist/"
		}
	});
	sync.watch('dist/**/*.*').on('change', sync.reload);
}

exports.build = series(cleanDist, copyStatic, toCSS, toHTML, babelJS, copyJS );
exports.start = series(cleanDist, copyStatic, toCSS, toHTML, babelJS, copyJS, parallel(watchFiles, browserSync));