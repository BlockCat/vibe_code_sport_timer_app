import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  promptEvent: any;

  constructor(private swUpdate: SwUpdate) {
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        if (confirm('A new version of the app is available. Load the new version?')) {
          window.location.reload();
        }
      });

    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });
  }

  installPwa(): void {
    if (this.promptEvent) {
      this.promptEvent.prompt();
      
      this.promptEvent.userChoice
        .then((choiceResult: { outcome: string; }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          this.promptEvent = null;
        });
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}