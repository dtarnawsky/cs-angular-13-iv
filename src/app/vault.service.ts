import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DeviceSecurityType, IdentityVaultConfig, Vault, VaultType } from '@ionic-enterprise/identity-vault';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  config: IdentityVaultConfig = {
    key: 'cs.ionic.',
    type: VaultType.DeviceSecurity,
    deviceSecurityType: DeviceSecurityType.Biometrics,
    lockAfterBackgrounded: 2000,
    shouldClearVaultAfterTooManyFailedAttempts: true,
    customPasscodeInvalidUnlockAttempts: 10,
    unlockVaultOnLoad: false,
  };

  private vault: Vault;

  constructor() {
    this.vault = new Vault(this.config);
    this.init();
   }

   async init() {
    this.vault.onConfigChanged(() => {
      console.log('Vault configuration was changed', this.config);
    });
    this.vault.onLock(() => {
      console.log('Vault was locked');
    });
    this.vault.onUnlock(() => {
      console.log('Vault was unlocked');
    });
    this.vault.onError((err) => {
      console.error('Vault error', err);
    });
   }

   async getData(): Promise<string> {
    console.log('Get Data....');
    const data = await this.vault.getValue('blar');
    console.log('Get Data', data);
    return data;
  }   

  async setData() {
    try {
      console.log('Setting data...');
      await this.vault.setValue('blar', 'test');
      console.log('Data is set');
    } catch (err) {
      console.error('vault.service.ts setData()', err);
    }
  }

  async lock(): Promise<boolean> {
    try {
      await this.vault.lock();
      console.log('vault was locked');
      return true;
    } catch (err) {
      console.error('vault.service.ts lock()', err);
      return false;
    }
  }

  async unlock() {
    try {
      await this.vault.unlock();
      console.log('vault was unlocked');
    } catch (err) {
      const msg = (typeof err == 'object') ? JSON.stringify(err) : err;
      console.error('vault.service.ts unlock()', msg);
    }
  }
}
