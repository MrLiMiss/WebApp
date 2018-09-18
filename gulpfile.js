var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var open = require('open');

var app = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};
//将js文件复制到其他目录
gulp.task('lib', function() {
    gulp.src('bower_components/**/*.js')
        .pipe(gulp.dest(app.devPath + 'vendor'))
        .pipe(gulp.dest(app.prdPath + 'vendor'))
        .pipe(plugins.connect.reload());
});
//将html文件复制到相应目录
gulp.task('html', function() {
    gulp.src(app.srcPath + '**/*.html')
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe(plugins.connect.reload());
});

//将json复制到相应目录
gulp.task('json', function() {
    gulp.src(app.srcPath + 'data/**/*.json')
        .pipe(gulp.dest(app.devPath + 'data'))
        .pipe(gulp.dest(app.prdPath + 'data'))
        .pipe(plugins.connect.reload());
});
//将less文件，复制 压缩 到相应目录
gulp.task('less', function() {
    gulp.src(app.srcPath + 'style/index.less')
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        .pipe(gulp.dest(app.devPath + 'css'))
        .pipe(plugins.cssmin())
        .pipe(gulp.dest(app.prdPath + 'css'))
        .pipe(plugins.connect.reload());
});

gulp.task('js', function() {
    gulp.src(app.srcPath + 'script/**/*.js')
        .pipe(plugins.plumber())
        .pipe(plugins.concat('index.js'))//合并js文件
        .pipe(gulp.dest(app.devPath + 'js'))
        .pipe(plugins.uglify())//丑化，压缩
        .pipe(gulp.dest(app.prdPath + 'js'))
        .pipe(plugins.connect.reload());
});

gulp.task('image', function() {
    gulp.src(app.srcPath + 'image/**/*')
        .pipe(plugins.plumber())
        .pipe(gulp.dest(app.devPath + 'image'))
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(app.prdPath + 'image'))
        .pipe(plugins.connect.reload());
});

//打包发布整个项目
gulp.task('build', ['image', 'js', 'less', 'lib', 'html', 'json']);

//防止老旧文件对项目上线产生影响，每次发布之前，先进行删除
gulp.task('clean', function() {
    gulp.src([app.devPath, app.prdPath])
        .pipe(plugins.clean());
});

gulp.task('serve', ['build'], function() {
    plugins.connect.server({
        root: [app.devPath],
        livereload: true,
        port: 3000
    });

    open('http://localhost:3000');

    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'image/**/*', ['image']);
});

gulp.task('default', ['serve']);
