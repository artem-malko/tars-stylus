'use strict';

var gulp = tars.packages.gulp;
var gutil = tars.packages.gutil;
var spritesmith = tars.packages.spritesmith;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;

var staticFolderName = tars.config.fs.staticFolderName;
var imagesFolderName = tars.config.fs.imagesFolderName;

/**
 * Make sprite for svg-fallback and stylus for this sprite
 */
module.exports = function () {

    return gulp.task('css:make-fallback-for-svg', function (cb) {

        var spriteData = '';

        if (tars.config.useSVG && tars.flags.ie8) {

            spriteData = gulp.src('./dev/' + staticFolderName + '/' + imagesFolderName + '/rastered-svg-images/*.png')
                .pipe(
                    spritesmith(
                        {
                            imgName: 'svg-fallback-sprite.png',
                            cssName: 'svg-fallback-sprite.styl',
                            Algorithms: 'diagonal',
                            cssTemplate: './markup/' + staticFolderName + '/stylus/sprite-generator-templates/stylus.svg-fallback-sprite.mustache'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making fallback for svg.\nLook in the console for details.\n' + error;
                }));

            spriteData.img.pipe(gulp.dest('./dev/' + staticFolderName + '/' + imagesFolderName + '/rastered-svg-sprite/'))
                .pipe(
                    notifier('Sprite img for svg is ready')
                );

            return spriteData.css.pipe(gulp.dest('./markup/' + staticFolderName + '/stylus/sprites-stylus/'))
                    .pipe(
                        notifier('Stylus for svg-sprite is ready')
                    );
        } else {
            gutil.log('!SVG is not used!');
            cb(null);
        }
    });
};