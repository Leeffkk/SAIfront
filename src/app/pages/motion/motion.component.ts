import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import FileSaver from 'file-saver';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrls: ['./motion.component.scss']
})
export class MotionComponent implements OnInit {

  fileName = '';

  status = '';

  new_fileName = '';

  model_param = 'RadarSAT';

  constructor(private http: HttpClient) { }

  onFileSelected(event) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("file", file);
        formData.append("model_param", this.model_param);

        const upload$ = this.http.post("http://localhost:3000/api/projects/uploadMotion", formData);
        
        upload$.subscribe(result=>{
          this.new_fileName = (result as any).data;
          this.status = "uploaded";
        });
    }
  }

  onSave(){
    if (this.new_fileName!=''){
      // console.log("flag1: ", this.new_fileName);

      const isReady$ = this.http.post("http://localhost:3000/api/projects/isReadyMotion",
        {name:this.new_fileName});
    
      isReady$.subscribe(result=>{

        if ((result as any).data == true){
          this.status="ready";
          const download$ = this.http.post("http://localhost:3000/api/projects/downloadMotion", 
            {name:this.new_fileName},{responseType:"blob"});
          
          download$.subscribe(result=>{
              // console.log(result);
              FileSaver(result, this.new_fileName);
            });

        }

        else{
          this.status="not ready";
          console.log("file not ready yet");
        }

      });

      
    }
    
  }

  // onSave(){
  //   if (this.new_fileName!=''){
  //     console.log("flag1: ", this.new_fileName);

  //     const download$ = this.http.post("http://localhost:3000/api/projects/downloadMotion", 
  //       {name:this.new_fileName},{responseType:"blob"});

      
  //     download$.subscribe(result=>{
  //         console.log(result);
  //         // let downloadURL = window.URL.createObjectURL(data);
  //         FileSaver(result, this.new_fileName);
  //       });
  //   }
    
  // }


  ngOnInit(): void {
  }

}
