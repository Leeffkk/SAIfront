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

  fileName1 = '';

  fileName2 = '';

  status = '';

  new_fileName1 = '';

  new_fileName2 = '';

  toRemove = 'true';

  comments = '';

  upload_result1 = '';

  upload_result2 = '';

  uploaded_image_url1: string | ArrayBuffer;
  uploaded_image_url2: string | ArrayBuffer;

  downloaded_image_url;

  constructor(private http: HttpClient) { }
  
  onFileSelected1(event) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName1 = file.name;

        const formData = new FormData();

        formData.append("file", file);

        // const upload$ = this.http.post("https://localhost:4396/api/projects/uploadMotion1", formData);
        const upload$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/uploadMotion1", formData);
        
        upload$.subscribe(result=>{
          this.new_fileName1 = (result as any).data;
          this.status = "uploaded";
        });

        let reader = new FileReader();
        
        reader.onloadend = () => {
          this.uploaded_image_url1 = reader.result;
        };
        reader.readAsDataURL(file);
    }
  }

  onFileSelected2(event) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName2 = file.name;

        const formData = new FormData();

        formData.append("file", file);
        formData.append("inputFile1", this.new_fileName1);
        formData.append("toRemove", this.toRemove);

        // const upload$ = this.http.post("https://localhost:4396/api/projects/uploadMotion2", formData);
        const upload$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/uploadMotion2", formData);
        
        upload$.subscribe(result=>{
          this.new_fileName2 = (result as any).data;
          this.status = "uploaded";
        });

        let reader = new FileReader();
        
        reader.onloadend = () => {
          this.uploaded_image_url2 = reader.result;
        };
        reader.readAsDataURL(file);
    }
  }

  onSave(){
    if (this.new_fileName2!=''){
      // console.log("flag1: ", this.new_fileName);

      // const isReady$ = this.http.post("https://localhost:4396/api/projects/isReadyMotion",
      const isReady$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/isReadyMotion",
        {name:this.new_fileName2});
    
      isReady$.subscribe(result=>{

        if ((result as any).data == true){
          this.status="ready";
          // const download$ = this.http.post("https://localhost:4396/api/projects/downloadMotion", 
          const download$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/downloadMotion", 
            {name:this.new_fileName2},{responseType:"blob"});
          
          download$.subscribe(result=>{
              // console.log(result);
              FileSaver(result, this.new_fileName2);

              let reader = new FileReader();
        
              reader.onloadend = () => {
                this.downloaded_image_url = reader.result;
              };
              reader.readAsDataURL(result);

            });

        }

        else{
          this.status="not ready";
          console.log("file not ready yet");
        }

      });

      
    }
    
  }

  reloadPage(){
    this.fileName1 = '';
    this.fileName2 = '';
    this.status = '';
  
    this.new_fileName1 = '';
    this.new_fileName2 = '';

    this.toRemove = 'true';

    this.comments = '';

    this.upload_result1 = '';
    this.upload_result2 = '';

  
    this.uploaded_image_url1 = null;
    this.uploaded_image_url2 = null;
    this.downloaded_image_url = null;
    
  }

  onUploadComments(){
    if (this.new_fileName1!='' && this.comments!=''){
      const uploadComments$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/updateComment",{
        output_name:this.new_fileName1,
        comments:this.comments
      });

      uploadComments$.subscribe(result=>{
        this.upload_result1 = "comments uploaded";
      });

    }

    else{
      this.upload_result1 = "not uploaded";
    }
    
  }

  ngOnInit(): void {
  }

}
