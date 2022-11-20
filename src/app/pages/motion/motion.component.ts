import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrls: ['./motion.component.scss']
})
export class MotionComponent implements OnInit {

  fileName = '';

  status = '';

  new_fileName = '';

  constructor(private http: HttpClient) { }

  onFileSelected(event) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("file", file);

        const upload$ = this.http.post("http://localhost:3000/api/projects/uploadMotion", formData);
        
        upload$.subscribe(result=>{
          this.new_fileName = (result as any).data;
          this.status = "uploaded";
        });
    }
  }

  ngOnInit(): void {
  }

}
