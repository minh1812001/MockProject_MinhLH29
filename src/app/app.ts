import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, BrowserModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MockProject_MinhLH29';
}
