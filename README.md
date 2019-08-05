# ionic4-app-update

1.新建一个ionic4项目

ionic start ionic4-app-update tabs

2.添加android平台

ionic cordova platform add android

3.安装版本更新所需要的插件

a).App Version---获取本地app当前版本号

    ionic cordova plugin add cordova-plugin-app-version

    npm install @ionic-native/app-version

b).File Transfer---下载文件

    ionic cordova plugin add cordova-plugin-file-transfer

    npm install @ionic-native/file-transfer

c).File---向手机写入文件

    ionic cordova plugin add cordova-plugin-file

    npm install @ionic-native/file

d).File Opener---打开apk文件，安装app

    ionic cordova plugin add cordova-plugin-file-opener2

    npm install @ionic-native/file-opener

e).Local Notifications---通知栏显示下载进度通知

    ionic cordova plugin add cordova-plugin-local-notification

    npm install @ionic-native/local-notifications

f).Android Permissions---获取android需要的一些权限，高版本需要手动请求权限

    ionic cordova plugin add cordova-plugin-android-permissions

    npm install @ionic-native/android-permissions

4.新建service，实现下载功能

a).获取当前app版本

    that.appVersion.getVersionNumber().then(v => {

                console.log(v);

                that.versionNumber = v;

    });

b).获取最新版本号，与本地版本号进行比较，不一致，则下载新版本


c).如果是IOS的话，需要安装In App Browser插件

    ionic cordova plugin add cordova-plugin-inappbrowser

    npm install @ionic-native/in-app-browser

d).IOS升级，按照https://blog.csdn.net/hnnd123/article/details/88943423，编写plist文件，并部署到服务器
e).IOS下载安装ipa

    that.inAppBrowser.create("itms-services://?action=download-manifest&amp;url=" + plisturl, '_system');

demo代码地址：https://github.com/Lemonsu/ionic4-app-update
