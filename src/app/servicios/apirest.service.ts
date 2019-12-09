import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApirestService {
  mainBasePath = 'https://y7tyidkjym1dbea-fincabf.adb.us-ashburn-1.oraclecloudapps.com/ords/bf_finca/bodega/';
  constructor(public http: HttpClient) { }

  public get_tipo_tran() {

    return this.http.get(this.mainBasePath + 'tipo_transaccion');
  }

  public get_prod_by_code(codigo) {
    let url = `prod_bodega?codigo=${codigo}`;
    return this.http.get(this.mainBasePath + url);

  }

}//end class
