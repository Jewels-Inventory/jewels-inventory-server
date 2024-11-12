import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApiModule } from './api/api.module';
import { MyJewelsComponent } from './my-jewels/my-jewels.component';
import { UiModule } from './ui/ui.module';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from './ui/confirm/confirm.component';
import { AddJewelComponent } from './add-jewel/add-jewel.component';
import { QuillConfigModule, QuillEditorComponent } from 'ngx-quill';
import { EditJewelComponent } from './edit-jewel/edit-jewel.component';
import { OwnersComponent } from './owners/owners.component';
import { DeviceListComponent } from './device-list/device-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MyJewelsComponent,
    AddJewelComponent,
    EditJewelComponent,
    DeviceListComponent,
    OwnersComponent
  ],
  imports: [
    ApiModule.forRoot({ rootUrl: '' }),
    BrowserModule,
    NgIf,
    RouterLink,
    OAuthModule.forRoot(),
    AuthenticationModule.forRoot(),
    RouterLinkActive,
    RouterModule.forRoot(
      [
        {
          component: MyJewelsComponent,
          path: 'my-jewels'
        },
        {
          component: OwnersComponent,
          path: 'owners'
        },
        {
          path: '**',
          redirectTo: 'my-jewels'
        }
      ],
      {
        bindToComponentInputs: true
      }
    ),
    UiModule,
    LucideAngularModule,
    FormsModule,
    ConfirmComponent,
    ReactiveFormsModule,
    QuillConfigModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],

          [{ size: ['small', false, 'large', 'huge'] }],

          ['clean']
        ]
      }
    }),
    QuillEditorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
