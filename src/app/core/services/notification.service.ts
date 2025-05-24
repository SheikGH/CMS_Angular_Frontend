// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private snackBar: MatSnackBar) { }

    success(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['snack-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }

    error(message: string): void {
        // this.snackBar.open(message, 'Close', {
        //     duration: 5000000,
        //     panelClass: ['snack-error'],
        //     horizontalPosition: 'right',
        //     verticalPosition: 'top'
        // });
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: 'snack-error',       // Applies on cdk-overlay-pane
            data: {},                        // Optional
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          
    }

    info(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 4000,
            panelClass: ['snack-info'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }

    warn(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 4000,
            panelClass: ['snack-warn'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }
}
