import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

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
  profileImageUrl = '';

  genderList: Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

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
          this.setProfileImage();
        } else {
          // Otherwise, show existing student functionality
          this.isNewStudent = false;
          this.pageHeader = 'Edit student';

          this._studentService.getStudent(this.studentId).subscribe(
            (successResponse) => {
              this.student = successResponse;
              this.setProfileImage(); // set to default
            },
            (errorResponse) => {
              this.setProfileImage(); // set to default
            }
          );
        }

        this._genderService.getGenderList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  onUpdate(): void {
    if (this.studentDetailsForm?.form.valid) {

      if ((this.student.mobile.toString().length < 5) || (this.student.mobile.toString().length > 10)) {
         this.snackbar.open('Mobile number must be 5 to 10 numbers long', undefined, {
           duration: 2000,
         });     
      } else {
             
        this._studentService
          .updateStudent(this.student.id, this.student)
          .subscribe(
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
    }    
  }

  onDelete(): void {
    // Call student service to update student
    this._studentService.deleteStudent(this.student.id).subscribe(
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
    if (this.studentDetailsForm?.form.valid) {
      // Submit form data to API
        this._studentService.addStudent(this.student).subscribe(
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
            console.log(errorResponse);
          }
        );
    }  
  }

  // *** CHECK FOR this.profileImageUrl **
  private setProfileImage(): void {
    if (this.student.profileImageUrl) {
      // Fetch the profile image by url
      this.profileImageUrl = this._studentService.getImagePath(this.student.profileImageUrl);
    } else {
      // Display a default
      this.profileImageUrl = '/assets/profile_image_male.png';
    }
  }

  uploadProfileImage(event: any): void {
    console.log('inside uploadProfileImage');

    if (this.studentId) {
      console.log('inside uploadProfileImage clause');
      const profileImageFile: File = event.target.files[0];
      this._studentService
        .uploadProfileImage(this.student.id, profileImageFile)
        .subscribe(
          (successResponse) => {
            this.student.profileImageUrl = successResponse;
            this.setProfileImage();
          },
          (errorResponse) => {
            // show a notification
            this.snackbar.open(
              'Profile images updated succesfully',
              undefined,
              {
                duration: 2000,
              }
            );
          }
        );
    }
  }
}