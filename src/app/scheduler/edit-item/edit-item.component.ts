import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Entry } from 'src/app/shared/entry.model';
import { DataService } from 'src/app/shared/data.service';
import { Subscription } from 'rxjs';

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
  showForm = false;

  isLoading = false;
  loadingSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      // const currItem = this.dataService.getEntry(this.id);

      if (currItem) {
        userName = currItem.userName;
        startDate = currItem.startDateTime;
        endDate = currItem.endDateTime;
        requestType = currItem.requestType;
        description = currItem.description;
      }
    }

    // date pipe
    const dp = new DatePipe(navigator.language);
    const dPipe = 'y-MM-ddTHH:mm'; // yyyy-mm-ddThh:mm

    this.entryForm = new FormGroup({
      startDateTime: new FormControl(
        // dp.transform(startDate, dPipe),
        // new Date(),
        startDate,
        Validators.required
      ),
      endDateTime: new FormControl(
        // dp.transform(endDate, dPipe),
        endDate,
        Validators.required
      ),
      userName: new FormControl(userName, Validators.required),
      requestType: new FormControl(requestType, Validators.required),
      description: new FormControl(description),
    });
  }

  onSubmit(): void {
    this.entryForm.markAllAsTouched();
    if (!this.entryForm.valid) {
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
    this.dataService.updateEntry(entry).subscribe((res: Entry) => {
      this.dataService.fetchEntries();
      this.onCancel();
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
