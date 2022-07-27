import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../models/ui-models/student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students: Student[] = []; // UI model

  // List columns for Angular materialize table
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'email',
    'mobile',
    'gender'
  ];

  // Create datasource for Angular materialize table
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();

  constructor(private _studentService: StudentService) {}

  ngOnInit(): void {
    // Fetch students
    this._studentService.getStudent().subscribe(
      (successRepsonse) => {
        this.students = successRepsonse;
        this.dataSource = new MatTableDataSource<Student>(this.students); // fill dataSource with list of students
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    ); // subscribe as studentservice returns an observable
  }
}