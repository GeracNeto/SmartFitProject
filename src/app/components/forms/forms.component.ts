import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnitsService } from 'src/app/services/units.service';
import { Location } from '../../types/location.interface';

const OPENNING_HOURS = {
  morning: {
    first: '06',
    last: '12',
  },
  afternoon: {
    first: '12',
    last: '18',
  },
  night: {
    first: '18',
    last: '23',
  },
};

type HOUR_INDEX = 'morning' | 'afternoon' | 'night';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  public results: Location[] = [];
  public filteredResults: Location[] = [];

  public formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private unitService: UnitsService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true,
    });

    this.unitService.getAllUnits().subscribe({
      next: (units) => {
        this.results = units.locations;
        this.filteredResults = units.locations;
      },
      error: (error) => {
        console.warn('Error to getting unit list', error);
      },
    });
  }

  private transformWeekday(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.';
      case 6:
        return 'Sab.';
      default:
        return 'Seg. à Sex';
    }
  }

  private filterUnites(
    unit: Location,
    open_hour: string,
    close_hour: string
  ): boolean {
    if (!unit.schedules) return true;

    const open_hour_filter = parseInt(open_hour, 10);
    const close_hour_filter = parseInt(close_hour, 10);

    const todays_weekday = this.transformWeekday(new Date().getDate());

    for (const schedule of unit.schedules) {
      const schedule_hour = schedule.hour;
      const schedule_weekday = schedule.weekdays;

      if (todays_weekday === schedule_weekday) {
        if (schedule_hour !== 'Fechada') {
          let [unit_open_hour, unit_close_hour] = schedule_hour.split(' às ');
          let unit_open_hour_int = parseInt(
            unit_open_hour.replace('h', ''),
            10
          );
          let unit_close_hour_int = parseInt(
            unit_close_hour.replace('h', ''),
            10
          );

          if (
            unit_open_hour_int <= open_hour_filter &&
            unit_close_hour_int >= close_hour_filter
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }

    return false;
  }

  public onSubmit() {
    let intermediateResults = this.results;

    if (!this.formGroup.value.showClosed) {
      intermediateResults = this.results.filter(
        (location) => location.opened === true
      );
    }

    if (this.formGroup.value.hour) {
      const OPEN_HOUR =
        OPENNING_HOURS[this.formGroup.value.hour as HOUR_INDEX].first;
      const CLOSE_HOUR =
        OPENNING_HOURS[this.formGroup.value.hour as HOUR_INDEX].last;

      this.filteredResults = intermediateResults.filter((location) =>
        this.filterUnites(location, OPEN_HOUR, CLOSE_HOUR)
      );
    } else {
      this.filteredResults = intermediateResults;
    }
  }

  public onClean() {
    this.formGroup.reset();
  }
}
