import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupName'
})
export class GroupNamePipe implements PipeTransform {

  transform(value: any): unknown {
    if(value=='1' ||value== '01'){
      return 'Paddy';
    }else if(value=='2'||value=='02'){
      return "Non Paddy"
    }else{
      return "Vegitable"
    }
  }

}
