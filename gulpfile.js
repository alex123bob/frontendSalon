var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    bowerprefix = 'bower_components',
    htmlreplace = require('gulp-html-replace'),
    rd = Date.now();

gulp.task('cleanForStepOne', function () {
    return gulp.src(
        [
            'build/step1/*.js',
            'build/step1/resources/img/*'
        ]
    )
        .pipe(clean());
});

gulp.task('compressJsForStepOne', function () {
    return gulp.src(
        [
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'libs/foundation.js',
            'libs/step1/controller/*.js',
            'libs/step1/directive/*.js'
        ]
    )
        .pipe(uglify())
        .pipe(concat('all.min.' + rd + '.js'))
        .pipe(gulp.dest('build/step1/'));
});

gulp.task('moveResourcesForStepOne', function (){
    return gulp.src('resources/img/*')
            .pipe(gulp.dest('build/step1/resources/img/'));
});

gulp.task('step1', ['cleanForStepOne', 'compressJsForStepOne', 'moveResourcesForStepOne'], function () {
    // replace html js link filename
    return gulp.src('step1.html')
        .pipe(htmlreplace({
            'js': 'all.min.' + rd + '.js',
            'css': {
                'src': '../../tpl/css/foundation.min',
                'tpl': '<link rel="stylesheet" href="%s.css">'
            }
        }))
        .pipe(gulp.dest('build/step1/'));
});