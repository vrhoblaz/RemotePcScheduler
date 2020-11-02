import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Entry } from 'src/app/shared/entry.model';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit {
  id: string;
  editMode = false;
  entryForm: FormGroup;
  displayError = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
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

    if (this.editMode) {
      userName = '';
      startDate = new Date();
      endDate = new Date();
      requestType = '';
      description = '';
    }

    // date pipe
    const dp = new DatePipe(navigator.language);
    const dPipe = 'y-MM-ddTHH:mm'; // yyyy-mm-ddThh:mm

    this.entryForm = new FormGroup({
      startDateTime: new FormControl(
        dp.transform(startDate, dPipe),
        Validators.required
      ),
      endDateTime: new FormControl(
        dp.transform(endDate, dPipe),
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
    this.dataService.addEntry(entry);
  }

  private generateId(): string {
    const randFactor = 1000;

    const time = new Date().getTime();
    const randomNum = Math.floor(Math.random() * randFactor);

    let id = (time * randFactor + randomNum).toString(16);

    return id;
  }
}
