import { Component, OnInit } from '@angular/core';
import { StudentService } from './student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  constructor(private _studentService: StudentService) { }

  ngOnInit(): void {
    // Fetch students
    this._studentService.getStudent()
      .subscribe(
        (successRepsonse) => {          
          console.log('Students fetched');
          console.log(successRepsonse[0].firstName);
          console.log(successRepsonse[0].lastName);
        },
        (errorResponse) => {          
          console.log(errorResponse);
        }
      ); // subscribe as studentservice returns an observable
  }
}