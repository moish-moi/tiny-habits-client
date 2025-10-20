import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { App } from './app';
import { Auth } from './auth/auth';
import { Habits } from './habits/habits';

@NgModule({
  declarations: [App, Auth, Habits],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App]
})
export class AppModule { }
