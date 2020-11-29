import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Entry } from 'src/app/shared/entry.model';
import { DataService } from 'src/app/shared/data.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit, OnDestroy {
  id: string;
  editMode = false;
  entryForm: FormGroup;
  displayError = false;
  generalError: string;
  showForm = false;
  minStart: Date;
  minEnd: Date;

  isLoading = false;
  loadingSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.minStart = new Date();
    this.minEnd = new Date(this.minStart.getTime() + 15 * 60 * 1000);
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.editMode = params.id != null;

      this.initForm();

      if (this.editMode) {
        this.dataService.fetchEntry(this.id).subscribe((databaseItem) => {
          if (databaseItem) {
            const currItem = new Entry(
              new Date(databaseItem.startDateTime),
              new Date(databaseItem.endDateTime),
              databaseItem.userName,
              databaseItem.requestType,
              databaseItem.description,
              databaseItem.id
            );
            this.initForm(currItem);
            this.showForm = true;
          } else {
            this.router.navigate(['/calendar']);
          }
        });
      } else {
        this.showForm = true;
      }
    });

    this.loadingSubscription = this.dataService.isLoading.subscribe(
      (isloading: boolean) => {
        this.isLoading = isloading;
      }
    );
  }

  initForm(currItem?: Entry): void {
    let userName = '';
    let startDate = new Date();
    let endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startDate.getHours() + 1,
      startDate.getMinutes()
    );
    let requestType = '';
    let description = '';

    if (currItem) {
      userName = currItem.userName;
      startDate = currItem.startDateTime;
      endDate = currItem.endDateTime;
      requestType = currItem.requestType;
      description = currItem.description;
    }

    this.entryForm = new FormGroup({
      startDateTime: new FormControl(startDate, Validators.required),
      endDateTime: new FormControl(endDate, Validators.required),
      userName: new FormControl(userName, [
        Validators.required,
        Validators.minLength(3),
      ]),
      requestType: new FormControl(requestType, Validators.required),
      description: new FormControl(description),
    });
  }

  getFormControl(fromName: string): FormControl {
    return <FormControl>this.entryForm.get(fromName);
  }

  getFormControlErrors(fromName: string): string {
    const control = <FormControl>this.entryForm.get(fromName);
    if (control === null || control.valid || control.untouched) {
      return '';
    }

    const errors = Object.keys(control.errors);
    let errMsg = '';
    const dateOptions = {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour12: false,
    };
    errors.forEach((element) => {
      switch (element) {
        case 'required':
          errMsg = 'This field is required!';
          break;
        case 'minlength':
          if (fromName === 'userName') {
            errMsg = 'Name must be at least 3 characters long!';
          } else {
            errMsg = 'To short!';
          }
          break;
        case 'owlDateTimeMin':
          if (fromName === 'startDateTime') {
            errMsg =
              'Start datetime must be after ' +
              new Intl.DateTimeFormat('si-SL', dateOptions).format(
                this.minStart
              ) +
              '!';
          } else if (fromName === 'endDateTime') {
            errMsg =
              'Start datetime must be after ' +
              new Intl.DateTimeFormat('sl-SI', dateOptions).format(
                this.minEnd
              ) +
              '!';
          } else {
            errMsg = 'Entered date not valid!';
          }
          break;
        default:
          errMsg = element;
          break;
      }
    });
    return errMsg;
  }

  onStartDateTimeChange() {
    const currStartDate = this.entryForm.get('startDateTime').value;
    this.minEnd = new Date(currStartDate.getTime() + 15 * 60 * 1000);
    this.getFormControl('endDateTime').markAsTouched();
  }

  onSubmit(): void {
    this.entryForm.markAllAsTouched();
    if (!this.entryForm.valid) {
      this.generalError = 'Please enter all required data';
      this.displayError = true;
      return null;
    }

    this.displayError = false;

    this.dataService.isLoading.next(true);

    const formValues: {
      startDateTime: Date;
      endDateTime: Date;
      userName: string;
      requestType: string;
      description: string;
    } = this.entryForm.value;

    const entry = new Entry(
      new Date(formValues.startDateTime),
      new Date(formValues.endDateTime),
      formValues.userName,
      formValues.requestType,
      formValues.description,
      this.editMode ? this.id : this.generateId()
    );
    this.dataService.updateEntry2(entry).then((promiseRes) => {
      if (promiseRes.status === 'success') {
        const obs = promiseRes.val as Observable<Entry>;
        obs.subscribe((res: Entry) => {
          this.dataService.fetchEntries();
          this.onCancel();
        });
      } else if (promiseRes.status === 'fail') {
        this.generalError = promiseRes.val as string;
        this.displayError = true;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/calendar']);
  }

  onDelete(): void {
    if (!this.editMode) {
      return;
    }

    this.dataService.isLoading.next(true);

    this.dataService.deleteEntry(this.id).subscribe((res: Entry) => {
      this.dataService.fetchEntries();
      this.onCancel();
    });
  }

  private generateId(): string {
    const randFactor = 1000;

    const time = new Date().getTime();
    const randomNum = Math.floor(Math.random() * randFactor);

    const id = (time * randFactor + randomNum).toString(16);

    return id;
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
