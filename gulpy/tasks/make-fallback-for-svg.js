var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var projectConfig = require('../../../tars-config');
var notifyConfig = projectConfig.notifyConfig;
var modifyDate = require('../../helpers/modifyDateFormatter');
var browserSync = require('browser-sync');

/**
 * Make sprite for svg-fallback and stylus for this sprite
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    return gulp.task('make-fallback-for-svg', function(cb) {
        var spriteData = '';

        if (projectConfig.useSVG && gutil.env.ie8) {

            spriteData = gulp.src('./dev/' + projectConfig.fs.staticFolderName + '/' + projectConfig.fs.imagesFolderName + '/rasterSvgImages/*.png')
                .pipe(
                    spritesmith(
                        {
                            imgName: 'svg-fallback-sprite.png',
                            cssName: 'svg-fallback-sprite.styl',
                            Algorithms: 'diagonal',
                            engineOpts: {
                                imagemagick: true
                            },
                            cssTemplate: './markup/' + projectConfig.fs.staticFolderName + '/stylus/spriteGeneratorTemplates/stylus.svgFallbackSprite.mustache'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making fallback for svg.\nLook in the console for details.\n' + error;
                }));

            spriteData.img.pipe(gulp.dest('./dev/' + projectConfig.fs.staticFolderName + '/' + projectConfig.fs.imagesFolderName + '/rasterSvgSprite/'))
                .pipe(
                    gulpif(notifyConfig.useNotify,
                        notify({
                            onLast: true,
                            sound: notifyConfig.sounds.onSuccess,
                            title: notifyConfig.title,
                            message: 'Sprite img for svg is ready. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                            templateOptions: {
                                date: modifyDate.getTimeOfModify()
                            }
                        })
                    )
                );

            return spriteData.css.pipe(gulp.dest('./markup/' + projectConfig.fs.staticFolderName + '/stylus/spritesStylus/'))
                    .pipe(browserSync.reload({stream:true}))
                    .pipe(
                        gulpif(notifyConfig.useNotify,
                            notify({
                                onLast: true,
                                sound: notifyConfig.sounds.onSuccess,
                                title: notifyConfig.title,
                                message: 'Stylus for svg-sprite is ready. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                                templateOptions: {
                                    date: modifyDate.getTimeOfModify()
                                }
                            })
                        )
                    );
        } else if (projectConfig.useSVG) {

            spriteData = gulp.src('./dev/' + projectConfig.fs.staticFolderName + '/' + projectConfig.fs.imagesFolderName + '/svg/*.svg')
                .pipe(
                    spritesmith(
                        {
                            imgName: 'svg-fallback-sprite.svg',
                            cssName: 'svg-fallback-sprite.styl',
                            Algorithms: 'diagonal',
                            engineOpts: {
                                imagemagick: true
                            },
                            cssTemplate: './markup/' + projectConfig.fs.staticFolderName + '/stylus/spriteGeneratorTemplates/stylus.svgFallbackSprite.mustache'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making fallback for svg.\nLook in the console for details.\n' + error;
                }));

                return spriteData.css.pipe(gulp.dest('./markup/' + projectConfig.fs.staticFolderName + '/stylus/spritesStylus/'))
                    .pipe(browserSync.reload({stream:true}))
                    .pipe(
                        gulpif(notifyConfig.useNotify,
                            notify({
                                onLast: true,
                                sound: notifyConfig.sounds.onSuccess,
                                title: notifyConfig.title,
                                message: 'Stylus for svg-sprite is ready. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                                templateOptions: {
                                    date: modifyDate.getTimeOfModify()
                                }
                            })
                        )
                    );
        } else {
            gutil.log('!SVG is not used!');
            cb(null);
        }
    });
};