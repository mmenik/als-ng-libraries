import { NgModule } from '@angular/core';
import { KeyboardDirective } from './directives/keyboard.directive';
import { KeyboardService } from './services/keyboard.service';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { KeyboardContainerComponent } from './components/keyboard-container/keyboard-container.component';
import { KeyboardKeyComponent } from './components/keyboard-key/keyboard-key.component';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KeyService } from './services/key.service';

@NgModule({
    imports: [
        CommonModule,
        OverlayModule,
        PortalModule,

        MatButtonModule,
        FlexLayoutModule
    ],
    declarations: [
        KeyboardDirective,
        KeyboardComponent,
        KeyboardContainerComponent,
        KeyboardKeyComponent
    ],
    entryComponents: [
        KeyboardComponent,
        KeyboardContainerComponent,
        KeyboardKeyComponent
    ],
    exports: [
        KeyboardDirective
    ],
    providers: [
        KeyboardService, KeyService
    ]
})

export class KeyboardModule { }
