import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ApirestService } from '../servicios/apirest.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  qrData = null;
  createdCode = null;
  scannedCode = null;

  arrayFaltantesFromServer = [];//array par alos faltantes de cualquier pedido
  arrayFaltantesToAlert = [];//array faltantes para mostrar en el laert controller y poder manipular
  enviado = false;//para saber si ya esta enviado el pedido
  array_pedidos;//array pedidos para mostrar en pedidos 


  constructor(public navCtrl: NavController, private apirest: ApirestService,
    public alertController: AlertController) {

  }

  ngOnInit() {
    this.initValues();

  }
  private initValues() {
    //inicair cargando el arrayFaltantesFromServer desde servidor
    this.get_pedidos();

  }
  public refreshData() {
    this.get_pedidos();
  }


  public async get_pedidos() {
    this.array_pedidos = await this.apirest.get_pedidos().toPromise();
    this.array_pedidos = this.array_pedidos.items;
  }


  public async get_faltantes_by_idPedido(nopedido) {
    let arrayFaltantesFromServer;
    arrayFaltantesFromServer = await this.apirest.get_faltantes_by_idPedido(nopedido).toPromise();
    arrayFaltantesFromServer = arrayFaltantesFromServer['items'];
    return arrayFaltantesFromServer;
  }


  public showFaltantes(nopedido) {
    this.apirest.get_faltantes_by_idPedido(nopedido).subscribe(async (elemento) => {
      let elementos = elemento['items'];
      console.log(elementos);
      await elementos.forEach((element, index) => {
        let Objecto = {
          name: 'chck' + (index + 1),
          type: 'checkbox',
          label: element['producto'] + ' ' + element['tamano'],
          value: element['id_prod_bodega'] + '',
          checked: index == 0 ? true : false
        }
        this.arrayFaltantesToAlert.push(Objecto);
      });


      const alert = await this.alertController.create({
        header: 'Faltantes #' + nopedido,
        inputs: this.arrayFaltantesToAlert,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
              this.arrayFaltantesToAlert = [];
            }
          }, {
            text: 'Completar',
            handler: () => {
              console.log('Confirm Ok');
            }
          }
        ]
      });
      if (!this.enviado)
        await alert.present();

    });
  }
  //show faltantes

}//end tab2
