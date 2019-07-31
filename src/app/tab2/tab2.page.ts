import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { UpdateAppService } from './../update-app-service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  appName: string;
  packageName: string;
  versionCode: any;
  versionNumber: string;
  downPercent: any = 0;

  constructor(private appVersion: AppVersion, public updateAppService: UpdateAppService) {
  }

  ionViewDidEnter() {
    console.log("tabs2 ionViewDidEnter");

    this.appVersion.getAppName().then(v => {
      this.appName = v;
    });

    this.appVersion.getPackageName().then(v => {
      this.packageName = v;
    });

    this.appVersion.getVersionCode().then(v => {
      this.versionCode = v;
    });

    this.appVersion.getVersionNumber().then(v => {
      this.versionNumber = v;
    });
  }

  updateApp() {
    this.updateAppService.checkUpdate();
  }
}
