import { Injectable, Inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as SecureStorage from 'secure-web-storage';
 
@Injectable({
  providedIn: 'root'
})
export class StorageService {
 constructor(@Inject('env') private env) {
 }

  secureStorage = new SecureStorage(localStorage, {
    hash: (key) => {
      key = CryptoJS.SHA256(key, this.env.config.secretKey);
      return key.toString();
    },
    encrypt: (data) => {
      data = CryptoJS.AES.encrypt(data, this.env.config.secretKey);
      return data.toString();
    },
    decrypt: (data) => {
      data = CryptoJS.AES.decrypt(data, this.env.config.secretKey);
      return data.toString(CryptoJS.enc.Utf8);
    }
  });
}
