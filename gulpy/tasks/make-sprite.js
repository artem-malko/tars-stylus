var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var projectConfig = require('../../projectConfig');
var notifyConfig = projectConfig.notifyConfig;
var modifyDate = require('../helpers/modifyDateFormatter');
var browserSync = require('browser-sync');

var dpi = projectConfig.useImagesForDisplayWithDpi;

/**
 * Make sprite and stylus for this sprite
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    return gulp.task('make-sprite', function() {

        var spriteData = [],
            dpiLength = dpi.length,
            dpi144 = false,
            dpi192 = false,
            dpi288 = false;

        for (var i = 0; i < dpiLength; i++) {
            if (dpi[i] == 144) {
                dpi144 = true;
            } else if (dpi[i] == 192) {
                dpi192 = true;
            } else if (dpi[i] == 288) {
                dpi288 = true;
            }
        }


        for (var i = 0; i < dpiLength; i++) {
            spriteData.push(gulp.src('./markup/' + projectConfig.fs.staticFolderName + '/' + projectConfig.fs.imagesFolderName + '/sprite/' + dpi[i] + 'dpi/*.png')
                .pipe(
                    spritesmith(
                        {
                            imgName: 'sprite.png',
                            cssName: 'sprite' + dpi[i] + '.styl',
                            Algorithms: 'diagonal',
                            engineOpts: {
                                imagemagick: true
                            },
                            cssOpts: {
                                dpi144: dpi144,
                                dpi192: dpi192,
                                dpi288: dpi288
                            },
                            cssTemplate: './markup/' + projectConfig.fs.staticFolderName + '/stylus/spriteGeneratorTemplates/stylus.sprite.mustache'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making png-sprite.\nLook in the console for details.\n' + error;
                }))
            );

            spriteData[i].img.pipe(gulp.dest('./dev/' + projectConfig.fs.staticFolderName + '/' + projectConfig.fs.imagesFolderName + '/pngSprite/' + dpi[i] + 'dpi/'))
                .pipe(
                    gulpif(notifyConfig.useNotify,
                        notify({
                            onLast: true,
                            sound: notifyConfig.sounds.onSuccess,
                            title: notifyConfig.title,
                            message: 'Sprite img with dpi = ' + dpi[i] + ' is ready. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                            templateOptions: {
                                date: modifyDate.getTimeOfModify()
                            }
                        })
                    )
                );
        }

        return spriteData[0].css.pipe(gulp.dest('./markup/' + projectConfig.fs.staticFolderName + '/stylus/spritesStylus/'))
                .pipe(browserSync.reload({stream:true}))
                .pipe(
                    gulpif(notifyConfig.useNotify,
                        notify({
                            onLast: true,
                            sound: notifyConfig.sounds.onSuccess,
                            title: notifyConfig.title,
                            message: 'Stylus for sprites is ready. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                            templateOptions: {
                                date: modifyDate.getTimeOfModify()
                            }
                        })
                    )
                );
        });
};