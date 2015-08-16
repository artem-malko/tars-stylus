var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var tarsConfig = require('../../../tars-config');
var notifier = require('../../helpers/notifier');

/**
 * Make sprite for svg-fallback and stylus for this sprite
 * @param  {Object} buildOptions
 */
module.exports = function (buildOptions) {

    return gulp.task('css:make-fallback-for-svg', function (cb) {

        var spriteData = '';

        if (tarsConfig.useSVG && gutil.env.ie8) {

            spriteData = gulp.src('./dev/' + tarsConfig.fs.staticFolderName + '/' + tarsConfig.fs.imagesFolderName + '/rastered-svg-images/*.png')
                .pipe(
                    spritesmith(
                        {
                            padding: 5,
                            imgName: 'svg-fallback-sprite.png',
                            cssName: 'svg-fallback-sprite.styl',
                            Algorithms: 'diagonal',
                            cssTemplate: './markup/' + tarsConfig.fs.staticFolderName + '/stylus/sprite-generator-templates/stylus.svg-fallback-sprite.mustache',
                            engine: 'phantomjssmith'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making fallback for svg.\nLook in the console for details.\n' + error;
                }));

            spriteData.img.pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/' + tarsConfig.fs.imagesFolderName + '/rastered-svg-sprite/'))
                .pipe(
                    notifier('Sprite img for svg is ready')
                );

            return spriteData.css.pipe(gulp.dest('./markup/' + tarsConfig.fs.staticFolderName + '/stylus/sprites-stylus/'))
                    .pipe(
                        notifier('Stylus for svg-sprite is ready')
                    );
        } else {
            gutil.log('!SVG is not used!');
            cb(null);
        }
    });
};
