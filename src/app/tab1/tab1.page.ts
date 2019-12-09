import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ApirestService } from '../servicios/apirest.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  transaccionForm;//para enviar formulario
  qrData = null;
  createdCode = null;
  scannedCode = null;
  nowDate = new Date();
  tipo_transaccion_select;//para elselect de tipo trnasacciones
  tipo_transaccion = 1;
  prod_bodega_array = [];

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner,
    public alertController: AlertController, private apirest: ApirestService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.init_values();
  }


  private init_values() {
    this.get_tipo_tran();
    this.form_set();
  }

  private form_set() {
    this.transaccionForm = this.fb.group({
      tipo: ['', Validators.required],
      concepto: ['', Validators.required],
      variedad: ['', Validators.required]
    });
    this.transaccionForm.controls.tipo.setValue(1);//ingreso como primera opcion en tipo de transaccion 
    // this.transaccionForm = new FormGroup({
    //   tipo: new FormControl('', Validators.required),
    //   concepto: new FormControl('', Validators.required)

    // });
  }

  private async get_tipo_tran() {
    this.tipo_transaccion_select = await this.apirest.get_tipo_tran().toPromise();
    this.tipo_transaccion_select = this.tipo_transaccion_select.items;//seleccionar la opcion de items
    console.log(this.tipo_transaccion_select);
  }

  private async scanCode() {
    let scannedCode = await this.barcodeScanner.scan();
    console.log(scannedCode);
    return scannedCode['text'];
  }

  public async returnScanedValue() {
    let scannedCode = await this.scanCode();
    // let scannedCode = 'PF400';
    let producto_bodega = await this.apirest.get_prod_by_code(scannedCode).toPromise();
    console.log(producto_bodega);
    // let code_exists = this.code_exists(scannedCode, this.prod_bodega_array);
    let code_exists = this.prod_bodega_array.some((element) => element.codigo == scannedCode);//devuelve un valor booleano si existe
    let indice;
    console.log('code_exists: ', code_exists);
    if (!code_exists) {
      let Objeto = {
        codigo: producto_bodega['gs1_prod'],
        cantidad: 1,
        variedad: producto_bodega['variedad'],
        tamano: producto_bodega['tamano']
      }
      this.prod_bodega_array.push(Objeto);
    }
    else {
      indice = this.prod_bodega_array.findIndex(obj => obj.codigo == scannedCode);//busca el indice de la variable psada dentro del objeto
      this.prod_bodega_array[indice].cantidad++;//add uno mas
    }
    console.log('array ', this.prod_bodega_array);

  }

  private give_inputs_alert_controller(n_cantidad) {
    let respuesta = [];
    //declarar el bojeto dentro del for para se creun nuevo 
    for (let index = 0; index < n_cantidad; index++) {
      let checked = false;
      if (index == 0)
        checked = true;
      let Objeto = {
        name: 'val' + (index + 1),
        type: 'radio',
        label: index + 1 + '',
        value: index + 1,
        checked: checked
      };
      respuesta.push(Objeto);
    }
    return respuesta;
  }

  //elimnar variedades
  async deleteVar(cant, cod) {
    const alert = await this.alertController.create({
      header: '¿C\xFAantos va eliminar?',
      inputs: this.give_inputs_alert_controller(cant),

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (val) => {
            console.log('val handler ', val);
            let indice = this.prod_bodega_array.findIndex(obj => obj.codigo == cod);
            // let indice = this.prod_bodega_array.map((element) => element.codigo).indexOf(cod);//busca el indice de la variable psada dentro del objeto
            if (val == cant)
              this.prod_bodega_array.splice(indice, 1);//delete ese objeto 
            else
              this.prod_bodega_array[indice].cantidad = this.prod_bodega_array[indice].cantidad - val;//add uno mas

            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
  }



}//endtab1page
