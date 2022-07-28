import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
    'gender',
  ];

  // Create datasource for Angular materialize table
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  filterString = "";

  constructor(private _studentService: StudentService) {}

  ngOnInit(): void {
    // Fetch students
    this._studentService.getStudents().subscribe(
      (successRepsonse) => {
        this.students = successRepsonse;
        this.dataSource = new MatTableDataSource<Student>(this.students); // fill dataSource with list of students

        if (this.matPaginator) {
          this.dataSource.paginator = this.matPaginator;
        }

        if (this.matSort) {
          this.dataSource.sort = this.matSort;
        }
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    ); // subscribe as studentservice returns an observable
  }

  filterStudents() {
    this.dataSource.filter = this.filterString.trim().toLowerCase();    
  }
}