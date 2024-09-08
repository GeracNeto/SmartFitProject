import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnitsService } from 'src/app/services/units.service';
import { Unites } from 'src/app/types/unites.interface';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  public results = [];

  public formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private unitService: UnitsService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: false,
    });

    this.unitService.getAllUnits().subscribe({
      next: (units) => {
        console.log('unidades: ', units);
      },
      error: (error) => {
        console.warn('Error to getting unit list', error);
      },
    });
  }

  public onSubmit() {
    console.log(this.formGroup);
  }

  public onClean() {
    this.formGroup.reset();
  }
}
