

1. 安装插件 npm i -g google-closure-compiler


2. 压缩文件：
web文件夹下
npx google-closure-compiler --js=viewer.js --js_output_file=viewer.min.js
build文件夹下
npx google-closure-compiler --js=pdf.js --js_output_file=pdf.min.js
npx google-closure-compiler --js=pdf.worker.js --js_output_file=pdf.worker.min.js


注意最终生效的是*.min.js  压缩前的js未被应用