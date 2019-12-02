import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  qrData = null;
  createdCode = null;
  scannedCode = null;

  constructor(public navCtrl: NavController) {

  }

  createCode() {
    this.createdCode = this.qrData;
  }


}//end tab3
