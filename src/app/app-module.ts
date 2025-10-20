import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // ✅ חדש
import { FormsModule } from '@angular/forms';   // ✅ חדש

import { App } from './app';
import { Auth } from './auth/auth';

@NgModule({
  declarations: [App, Auth],
  imports: [
    BrowserModule,
    HttpClientModule,  
    FormsModule          // ✅ חדש
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App]
})
export class AppModule { }
