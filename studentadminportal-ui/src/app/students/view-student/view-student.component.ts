import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;

  constructor(
    private readonly _studentService: StudentService,
    private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id'); // NOTE: 'id' is as specified in the routing-module !

        if (this.studentId) {
          this._studentService.getStudent(this.studentId)
            .subscribe(
              (successResponse) => {
                console.log(successResponse);
              }
            );
        }
      }
    );    
  }
}