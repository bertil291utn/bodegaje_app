import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApirestService {
  domain_cab = 'https://y7tyidkjym1dbea-fincabf.adb.us-ashburn-1.oraclecloudapps.com/';
  domain_tail = 'ords/bf_finca/bodega/';
  mainBasePath = this.domain_cab + this.domain_tail;
  constructor(public http: HttpClient) { }

  public get_tipo_tran() {

    return this.http.get(this.mainBasePath + 'tipo_transaccion');
  }

  public get_prod_by_code(codigo) {
    let url = `prod_bodega?codigo=${codigo}`;
    return this.http.get(this.mainBasePath + url);

  }

  public save_encabezado_tran(data) {
    let url = `transaccion?concepto=${data.concepto}&tipo_transaccion=${data.tipo}`;
    return this.http.post(this.mainBasePath + url, { responseType: 'json' });
  }

  public save_detalles_tran(id_tran_padre, data) {

    let url = `transaccion?id_transaccion_padre=${id_tran_padre}&producto_bodega=${data.id_prod_bodega}&cantidad=${data.cantidad}`;
    return this.http.put(this.mainBasePath + url, { responseType: 'json' });
  }

  public get_pedidos() {
    let url = `pedidos`;
    return this.http.get(this.mainBasePath + url);

  }

  public get_faltantes_by_idPedido(id_pedido) {
    let url = `faltantes?pedido=${id_pedido}`;
    return this.http.get(this.mainBasePath + url);

  }


}//end class
