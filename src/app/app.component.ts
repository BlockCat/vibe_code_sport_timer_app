import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaInstallComponent } from './components/pwa-install/pwa-install.component';
import { NotificationPromptComponent } from './components/notification-prompt/notification-prompt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PwaInstallComponent, NotificationPromptComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'sport-timer-app';
}
