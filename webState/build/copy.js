require('shelljs/global')

rm('-rf', './views/dist/')
mkdir('-p', './views/dist/')
cp('-R', 'favicon.ico', './views/dist/')
cp('-R', 'robots.txt', './views/dist/')
// cp('-R', 'static/ueditor/', './dist/ueditor/')
