import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quintals'
})
export class QuintalsPipe implements PipeTransform {

  transform(noOfBag: number,sizeOfBag:number){
     return noOfBag*sizeOfBag/100
  }

}
