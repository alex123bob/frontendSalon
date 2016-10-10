var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    bowerprefix = 'bower_components',
    htmlreplace = require('gulp-html-replace'),
    rd = Date.now();

gulp.task('cleanForStepOne', function () {
    return gulp.src('build/step1/*.js')
        .pipe(clean());
});

gulp.task('compressForStepOne', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js'
    ])
        .pipe(uglify())
        .pipe(concat('all.min.' + rd + '.js'))
        .pipe(gulp.dest('build/step1/'));
});

gulp.task('step1', ['cleanForStepOne', 'compressForStepOne'], function () {
    // replace html js link filename
    return gulp.src('step1.html')
        .pipe(htmlreplace({
            'js': 'all.min.' + rd + '.js'
        }))
        .pipe(gulp.dest('build/step1/'));
});