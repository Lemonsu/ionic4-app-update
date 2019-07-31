import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Injectable({
    providedIn: 'root'
})
export class UpdateAppService {
    public versionNumber: string = '';
    public downPercent: number = 0;
    public timer: any = null;

    constructor(public loadingCtrl: LoadingController, private appVersion: AppVersion, private transfer: FileTransfer, private file: File,
        private fileOpener: FileOpener, private localNotifications: LocalNotifications,
        private androidPermissions: AndroidPermissions) {
    }

    checkUpdate() {
        this.appVersion.getVersionNumber().then(v => {
            this.versionNumber = v;

            // 从接口获取到版本号，与当前apk版本号比较，不同，则下载新的apk
            if (this.versionNumber == '0.0.1') {
                this.download();
            }
        });
    }

    download() {
        // console.log("download");
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
            result => {
                // console.log('Has permission?', result.hasPermission);
                if (!result.hasPermission) {
                    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(data => {
                        // console.log("download", data);
                        this.downloadFile();
                    });
                } else {
                    this.downloadFile();
                }
            },
            err => {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(data => {
                    // console.log("download", data);
                    this.downloadFile();
                });;
            }
        );
    }

    showLocalNotifications() {
        this.localNotifications.hasPermission().then(data => {
            // console.log('Has permission?', data);
            if (!data) {
                this.localNotifications.requestPermission().then(data => {
                    // console.log("localNotifications requestPermission", data);

                    this.localNotifications.schedule({
                        id: 666666,
                        title: 'app update',
                        text: this.downPercent + '%',
                        progressBar: { value: this.downPercent }
                    });
                })
            } else {
                this.localNotifications.schedule({
                    id: 666666,
                    title: 'app update',
                    text: this.downPercent + '%',
                    progressBar: { value: this.downPercent }
                });
            }
        });
    }

    updateLocalNotifications() {
        this.localNotifications.update({
            id: 666666,
            title: 'app update',
            text: this.downPercent + '%',
            progressBar: { value: this.downPercent }
        });
    }

    showLoading() {
        this.loadingCtrl.create({
            spinner: 'dots',
            message: '下载进度：'+ this.downPercent + '%'
        }).then(a => {
            a.present();
        });
    }

    dismissLoading() {
        this.loadingCtrl.dismiss();
    }

    downloadFile() {
        // console.log("downloadFile");
        this.showLocalNotifications();
        this.showLoading();

        const url = 'http://localhost:9003/app-debug.apk';
        const fileName = this.file.externalRootDirectory + '/app-debug.apk';
        // console.log("fileName = " + fileName);

        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(url, fileName).then((entry) => {
            // console.log('downloadFile complete: ' + entry.toURL());
    
            this.fileOpener.open(fileName, 'application/vnd.android.package-archive')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));

        }, (error) => {
            // console.log('downloadFile error');
            console.log(error);
            this.dismissLoading();
            this.localNotifications.clear(666666);
        });

        fileTransfer.onProgress((event: ProgressEvent) => {
            // console.log('event.total = ' + event.total + ', event.loaded = ' + event.loaded);
            if (event.total > 0) {
                let percent = Math.floor(event.loaded / event.total * 100);

                if (this.downPercent < percent) {
                    this.downPercent = percent;
                    if (this.downPercent === 100) {
                        this.localNotifications.clear(666666);
                        this.dismissLoading();
                    } else {
                        this.updateLocalNotifications(); 
                        const title = document.getElementsByClassName('loading-content')[0];
                        title && (title.innerHTML = '下载进度' + this.downPercent + '%');
                    }
                }
            }
        });
    }
}