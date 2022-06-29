import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { VaultService } from './vault.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Test';

  constructor(private vaultService: VaultService) {
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        console.log('can not go back. exiting app');
        App.exitApp();
      } else {
        console.log('going back');
        window.history.back();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const data = await this.vaultService.getData();
    if (data == null) {
      await this.vaultService.setData();
      await this.vaultService.lock();
    }
  }
}
