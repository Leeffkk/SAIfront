import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import FileSaver from 'file-saver';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  fileName = '';

  status = '';

  new_fileName = '';

  model_param = 'RadarSAT';

  uploaded_image_url: string | ArrayBuffer;
  image_source;
  new_url;

  downloaded_image_url;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  onFileSelected(event) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("file", file);
        formData.append("model_param", this.model_param);

        // const upload$ = this.http.post("http://localhost:3000/api/projects/uploadLead", formData);
        const upload$ = this.http.post("http://vims.cis.udel.edu:4396/api/projects/uploadLead", formData);
        
        upload$.subscribe(result=>{
          this.new_fileName = (result as any).data;
          this.status = "uploaded";
        });

        let reader = new FileReader();
        
        reader.onloadend = () => {
          this.uploaded_image_url = reader.result;
          // console.log(typeof this.uploaded_image_url);

          // this.new_url = this.uploaded_image_url.toString().replace('tiff', 'png');
          // console.log(
          //   this.new_url
          // );

          // this.image_source = this.sanitizer.bypassSecurityTrustUrl(
          //   this.new_url.toString()
          // );
        };
        reader.readAsDataURL(file);

        
        // this.image_source = this.sanitizer.bypassSecurityTrustUrl(
        //   this.image_url[0]
        // );

    }
  }

  onSave(){
    if (this.new_fileName!=''){
      // console.log("flag1: ", this.new_fileName);

      // const isReady$ = this.http.post("http://localhost:3000/api/projects/isReadyLead",
      const isReady$ = this.http.post("http://vims.cis.udel.edu:4396/api/projects/isReadyLead",
        {name:this.new_fileName});
    
      isReady$.subscribe(result=>{

        if ((result as any).data == true){
          this.status="ready";
          // const download$ = this.http.post("http://localhost:3000/api/projects/downloadLead", 
          const download$ = this.http.post("http://vims.cis.udel.edu:4396/api/projects/downloadLead", 
            {name:this.new_fileName},{responseType:"blob"});
          
          download$.subscribe(result=>{
              // console.log(result);
              FileSaver(result, this.new_fileName);

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
    this.fileName = '';

    this.status = '';
  
    this.new_fileName = '';
  
    // model_param = 'RadarSAT';
  
    this.uploaded_image_url = null;
    this.image_source = null;
    this.new_url = null;
  
    this.downloaded_image_url = null;
  }

  ngOnInit(): void {
  }

}
