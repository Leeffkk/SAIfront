import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import FileSaver from 'file-saver';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import LabelImg from 'label-img';
import { of } from 'rxjs';

let labeler;

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  // labeler = new LabelImg(<HTMLDivElement>document.getElementById("anno-div"), {
  //   width: 800,
  //   height: 600,
  //   bgColor: `#000`, // 背景色
  //   imagePlacement: <any>"default", // default | center
  // });

  fileName = '';

  status = '';

  new_fileName = '';

  model_param = 'RadarSAT';

  toRemove = 'true';

  comments = '';

  upload_result = '';

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
        formData.append("toRemove", this.toRemove);

        // const upload$ = this.http.post("https://localhost:4396/api/projects/uploadLead", formData);
        const upload$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/uploadLead", formData);
        
        upload$.subscribe(result=>{
          if ((result as any).status == 'success'){
            this.new_fileName = (result as any).data;
            this.status = "uploaded";
  
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
              // console.log("upload image url: ", this.uploaded_image_url);
              
            };
            reader.readAsDataURL(file);
          } else{
            console.error("upload motion error: ", (result as any).data);
          }

        });



        
        // this.image_source = this.sanitizer.bypassSecurityTrustUrl(
        //   this.image_url[0]
        // );

    }
  }

  onSave(){
    if (this.new_fileName!=''){
      // console.log("flag1: ", this.new_fileName);

      // const isReady$ = this.http.post("https://localhost:4396/api/projects/isReadyLead",
      const isReady$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/isReadyLead",
        {name:this.new_fileName});
    
      isReady$.subscribe(result=>{

        if ((result as any).data == true){
          this.status="ready";
          // const download$ = this.http.post("https://localhost:4396/api/projects/downloadLead", 
          const download$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/downloadLead", 
            {name:this.new_fileName},{responseType:"blob"});
          
          download$.subscribe(result=>{
              // console.log(result);
              FileSaver(result, this.new_fileName);

              let reader = new FileReader();
        
              reader.onloadend = () => {
                this.downloaded_image_url = reader.result;
                // console.log("downloaded_image_url", this.downloaded_image_url);
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

    this.toRemove = 'true';

    this.comments = '';

    this.upload_result = '';
  
    // model_param = 'RadarSAT';
  
    this.uploaded_image_url = null;
    this.image_source = null;
    this.new_url = null;
  
    this.downloaded_image_url = null;
    
  }

  onUploadComments(){
    if (this.new_fileName!='' && this.comments!=''){
      const uploadComments$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/updateComment",{
        output_name:this.new_fileName,
        comments:this.comments
      });

      uploadComments$.subscribe(result=>{
        this.upload_result = "comments uploaded";
      });

    }

    else{
      this.upload_result = "not uploaded";
    }
    
  }

  ngOnInit(): void {

  }
  
  ngAfterViewInit(): void {
    console.log("here!!!!!!!!");

    labeler = new LabelImg(<HTMLDivElement>document.getElementById("anno-div"), {
      width: 800,
      height: 600,
      bgColor: `#000`, // 背景色
      imagePlacement: <any>"center", // default | center
    });

    labeler.register("myPolygon", {
      type: "Polygon",
      tag: "myTag",
      name: 'myName'
    });
    // labeler.load('https://hold-baby.github.io/label-img/dog.jpg');
    // labeler.Image.loadFromImg(document.querySelector("#image-to-annotate"));

  }

  onNewPolygon(){
    labeler.label("myPolygon");
  }

  onLoadImage(){
    labeler.load(this.uploaded_image_url);
  }

  onSaveAnnotation(){
    
    let position_list = labeler.getShapeList();
    let positions = new Array(position_list.length);

    for (var i=0; i<position_list.length; i++){
      // console.log(position_list[i].getPositions());
      positions[i] = position_list[i].getPositions();
    }

    console.log(positions);

    const uploadAnnotation$ = this.http.post("https://vims.cis.udel.edu/sai/api/projects/uploadLeadAnnotation",{
      name:this.new_fileName.split('.')[0]+'.txt',
      positions:positions
    });

    uploadAnnotation$.subscribe(result=>{
      console.log("annotation uploaded");
    });

  }

}
