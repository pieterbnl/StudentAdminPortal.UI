import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})

export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;

  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };

  isNewStudent = false;
  pageHeader = '';

  genderList: Gender[] = [];

  constructor(
    private readonly _studentService: StudentService,
    private readonly _genderService: GenderService,
    private readonly route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id'); // NOTE: 'id' is as specified in the routing-module !

      if (this.studentId) {      
        if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
        // If the route contains 'add' then show new student functionality
          this.isNewStudent = true;
          this.pageHeader = 'Add new student';
        } 
        else       
        {
        // Otherwise, show existing student functionality
          this.isNewStudent = false;
          this.pageHeader = 'Edit student';

          this._studentService
            .getStudent(this.studentId)
            .subscribe((successResponse) => {
              this.student = successResponse;
            });
        }   

        this._genderService.getGenderList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  onUpdate(): void {
    // Call student service to update student
    this._studentService.updateStudent(this.student.id, this.student).subscribe(
      (successResponse) => {
        // show a notification
        this.snackbar.open('Student updated succesfully', undefined, {
          duration: 2000,
        });
      },
      (errorResponse) => {
        // log it
      }
    );
  }

  onDelete(): void {
    // Call student service to update student
    this._studentService.deleteStudent(this.student.id)
    .subscribe(
      (successResponse) => {
        this.router.navigateByUrl('students');
        
        // show a notification
        this.snackbar.open('Student deleted succesfully', undefined, {
          duration: 2000,
        });

        // setTimeout(() => {
        //   this.router.navigateByUrl('students');
        // }, 2000);        
      },
      (errorResponse) => {
        // log it
      }
    );
  }

  onAdd(): void {
    this._studentService.addStudent(this.student)
    .subscribe(
      (successResponse) => {
        // show a notification
        this.snackbar.open('Student added succesfully', undefined, {
          duration: 2000,
        });

        setTimeout(() => {
          this.router.navigateByUrl(`students/${successResponse.id}`);
        }, 2000);                
      },
      (errorResponse) => {
        // console.log(errorResponse);
      }
    );
    
  }
}