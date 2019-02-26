"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser
var browserify = require('browserify'); //boundle JS
var reactify = require('reactify'); // Transform Reat JSX to JS
var source = require('vinyl-source-stream'); //Use conventional text stremas with gulp
var concat = require('gulp-concat'); //concat files

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/main.js' 

    }
}

//Start a local development server
gulp.task('connect',function(){
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true,
    });
});

//Open an given file in the server
// the second argument is a dependecy so before calling the task open it will call connect
gulp.task('open', [ 'connect' ],function(){
    gulp.src('dist/index.html')
        .pipe(open({url: config.devbaseUrl + ":" + config.port + '/'}));
});

 gulp.task('html', function(){
     gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload())
 });


 gulp.task('js', function(){
    browserify(config.paths.mainJs)
       .transform(reactify)
       .bundle()
       .on('error', console.error.bind(console))
       .pipe(source('bundle.js'))
       .pipe(gulp.dest(config.paths.dist + '/scripts'))
       .pipe(connect.reload()); 
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
});

 //every time that any of the html files change it will call html gulp task
 gulp.task('watch', function(){
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
 });

 gulp.task('default', ['html','js','css','open','watch']);