import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'circle'
})
export class CirclePipe implements PipeTransform {

  transform(zoneName: any, sourceZone:any) {
    
    if(zoneName==sourceZone){
      return 'Intra'
    }else{
      return "Inter"
    }
  }

}
