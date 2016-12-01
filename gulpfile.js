var gulp=require('gulp');
var uglify=require('gulp-uglify');
var concat=require('gulp-concat');
var through = require("through2");
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');//图片压缩
var pngcrush = require('imagemin-pngcrush');
var pngquant = require('imagemin-pngquant');//图片深入压缩
var  imageminOptipng = require('imagemin-optipng');
var  imageminSvgo = require('imagemin-svgo');
var  imageminGifsicle = require('imagemin-gifsicle');
var  imageminJpegtran = require('imagemin-jpegtran');
var plumber = require('gulp-plumber');//检测错误
var gutil = require('gulp-util');//如果有自定义方法，会用到
 var cache = require('gulp-cache');//图片压缩缓存
var clean = require('gulp-clean');//清空文件夹
var conCat = require('gulp-concat');//文件合并
var connect = require("gulp-connect");
var htmlmin = require('gulp-htmlmin');//html压缩
var  processhtml = require('gulp-processhtml');
 var   Replace = require('gulp-replace');
var date = new Date().getTime();
var livereload = require('gulp-livereload');//服务器<-->文件自动更新
var webserver = require('gulp-webserver'); // 本地服务器
var domSrc = require('gulp-dom-src');
var    cheerio = require('gulp-cheerio');

function errrHandler( e ){
    // 控制台发声,错误时beep一下
    gutil.beep();
    gutil.log(e);
    this.emit('end');
}

function minifyAndComboCSS(name, encode, files){
  var fs = require("fs");
  var CleanCSS = require("clean-css");
  var content = "";

  files.forEach(function(css){
    var contents = fs.readFileSync(css, encode);
    var minified = new CleanCSS().minify(contents).styles; 
    content += minified;
  });

  if(content){
    var combo = "../**/*.css";
  }
  fs.writeFileSync(combo, content);

  gulp.src(combo)
      .pipe(gulp.dest("./dist/static/css"));
}

gulp.task("lint", function() {
  return gulp.src("./public/xd.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});

 

function minifyAndComboJS(name, encode, files){
  var fs = require("fs");
  var UglifyJS = require("uglify-js");
  var content = "";

  files.forEach(function(js){
    var minified = UglifyJS.minify(js).code;
    content += minified;
  });

  if(content){
    var combo = "./public/js/*.js";
  }
  fs.writeFileSync(combo, content);

  gulp.src(combo)
      .pipe(gulp.dest("./dist/static/js"));
}

gulp.task("clean",function(){
    return gulp.src('dist/concatjs/**',{read:false})
        .pipe(clean());
});



gulp.task('build-index', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('./public/*.html')       
        .pipe(plumber({errorHandler:errrHandler}))     
        .pipe(Replace(/_VERSION_/gi, date))
        .pipe(processhtml())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});








gulp.task("build-js-lib", function(){
  gulp.src("./public/**/*.js")
      .pipe(through.obj(function(file, encode, cb) {
        var UglifyJS = require("uglify-js");

        var contents = file.contents.toString(encode);
        var minified = UglifyJS.minify(contents, 
          {fromString:true}).code;

        file.contents = new Buffer(minified, encode);
        cb(null, file, encode);
      }))
      .pipe(gulp.dest("./dist/static/js/lib"));
});

gulp.task("build-common-css", function(){
  gulp.src("./public/*.css")
      .pipe(through.obj(function(file, encode, cb) {
        var CleanCSS = require("clean-css");

        var contents = file.contents.toString(encode);
        var minified = new CleanCSS().minify(contents).styles;  

        file.contents = new Buffer(minified, encode);
        cb(null, file, encode);
      }))
      .pipe(gulp.dest("./dist/static/css/common"));
});


gulp.task("img", function () {
    gulp.src('./public/img/*.{png,jpg,gif,ico}')
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(cache(imagemin({     
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片          
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant(),imageminJpegtran({progressive: true})
            , imageminGifsicle({interlaced: true}),imageminOptipng({optimizationLevel:3}), imageminSvgo()] //使用pngquant深度压缩png图片的imagemin插件          
        })))
        .pipe(gulp.dest('dist/images'));
});


gulp.task('jsmin', function () {
    gulp.src(['./public/js/*.js'])
        .pipe(conCat('./public/js/xd.js'))
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(uglify({
            mangle: {except: ['require' ,'exports' ,'module' ,'$']},//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'false' //保留所有注释
        }))
        .pipe(gulp.dest('dist/concatjs'));
}); 



gulp.task('watch', function(){
    //gulp.run( "connect","build-index","build-js-lib", "build-common-css","lint","img","jsmin","clean");
 // 监听html文件变化
    //gulp.watch('./public/*.html', function(){
      //  gulp.run("build-index");
   // });
      gulp.watch('./public/*.html', ["html"]);
    // Watch .css files
    gulp.watch('./public/*.css', ["build-common-css"]);

    // Watch .js files
    gulp.watch('./public/js/*.js', ['lint', "build-js-lib",'jsmin']);

    // Watch image files
    gulp.watch('./public/img/*', ['img']);
});

 gulp.task('connect',function(){
    connect.server({
        root:'./',  
        ip:'192.168.31.110',
        livereload:true
    });
});


gulp.task('html', function () {
  gulp.src('./public/*.html')
    .pipe(connect.reload());
});




gulp.task('default', function(){
    gulp.run( "connect","watch","build-index","build-js-lib", "build-common-css","lint","img","jsmin","clean");
 // 监听html文件变化
})