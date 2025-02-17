import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import Pickr from '@simonwep/pickr';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatCheckbox
  ],
})
export class AppointmentDialogComponent implements OnInit {
  appointmentForm: FormGroup;
  pickr: Pickr | null = null;
  color: string = "black";

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uuid: string;
      date: Date;
      title: string;
      startTime: string;
      endTime: string;
      color: string;
      completed: boolean;
    },
    private formBuilder: FormBuilder
  ) {
    this.appointmentForm = this.formBuilder.group(
      {
        title: [this.data.title || '', Validators.required],
        date: [this.data.date, Validators.required],
        startTime: [this.data.startTime || '', Validators.required],
        endTime: [this.data.endTime || '', Validators.required],
        completed: new FormControl(this.data.completed)
      },
      { validators: this.timeRangeValidator },
    );

    this.appointmentForm.get('completed')?.valueChanges.subscribe(value => {
      this.data.completed = value; // Sync value with data.completed
    });
  }

  ngOnInit() {
    if (this.data.uuid) {
      this.color = this.data.color;
    }
    this.initColorPicker();
  }

  onColorClick() {
    this.pickr?.show();
  }

  ngOnDestroy() {
    this.pickr?.destroyAndRemove();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.appointmentForm.valid) {
      const data = {
        title: this.appointmentForm.controls['title'].value,
        date: this.appointmentForm.controls['date'].value,
        startTime: this.appointmentForm.controls['startTime'].value,
        endTime: this.appointmentForm.controls['endTime'].value,
        uuid: this.data.uuid,
        completed: this.data.completed,
        color: this.data.color
      };
      this.dialogRef.close(data);
    }
  }

  onDeleteClick(): void {
    this.dialogRef.close({ remove: true, uuid: this.data.uuid });
  }

  timeRangeValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':');
      const [endHours, endMinutes] = endTime.split(':');

      const startDate = new Date();
      startDate.setHours(startHours);
      startDate.setMinutes(startMinutes);

      const endDate = new Date();
      endDate.setHours(endHours);
      endDate.setMinutes(endMinutes);

      if (startDate > endDate) {
        return { timeRangeInvalid: true };
      }
    }
    return null;
  };

  private initColorPicker() {
    this.pickr = Pickr.create({
      el: '.color-picker',
      theme: 'monolith',
      useAsButton: true,
      position: "left-end",
      autoReposition: true,
      default: 'pink',
      lockOpacity: true,
      swatches: ['382215', '7C3F20', 'C06F37', 'FEAD6C', 'FFD2B1', 'FFA4D0',
        'F14FB4', 'E973FF', 'A630D2', '531D8C', '242367', '0334BF', '149CFF', '8DF5FF', '01BFA5', '16777E', '054523', '18862F',
        '61E021', 'B1FF37', 'FFFFA5', 'FDE111', 'FF9F17', 'F66E08', '550022', '99011A', 'F30F0C', 'FF7872'],
      components: {

        preview: true,
        opacity: false,
        hue: true,

        interaction: {
          hex: false,
          rgba: false,
          cancel: false,
          input: false,
          clear: false,
          save: false
        }
      }
    });

    this.pickr.on('change', (color: any) => {
      const hexa = color.toHEXA();
      this.color = "#" + hexa[0] + hexa[1] + hexa[2];
      this.data.color = this.color;
    });
  }
}
