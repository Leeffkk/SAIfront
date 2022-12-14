import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddprojectComponent } from './pages/addproject/addproject.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MyprojectsComponent } from './pages/myprojects/myprojects.component';
import { UpdateProjectComponent } from './pages/updateproject/updateproject.component';
import { ManageprojectComponent } from './pages/manageproject/manageproject.component';
import { MyrequistsComponent } from './pages/myrequists/myrequists.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MydialogComponent } from './mydialog/mydialog.component';
import { UpdatePOPComponent } from './update-pop/update-pop.component';
import { MotionComponent } from './pages/motion/motion.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { LeadComponent } from './pages/lead/lead.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AddprojectComponent,
    MyprojectsComponent, //DialogContentExampleDialog
    UpdateProjectComponent,
    ManageprojectComponent,
    MyrequistsComponent,
    MydialogComponent,
    UpdatePOPComponent,
    MotionComponent,
    LeadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatStepperModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    MatCardModule
  ],
  entryComponents: [
    MydialogComponent,
    UpdatePOPComponent
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
