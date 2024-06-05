import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';  
import { TopBarComponent } from './components/top-bar/top-bar.component';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, TopBarComponent]
})
export class AppComponent {
    title = 'Employee';
 
}
