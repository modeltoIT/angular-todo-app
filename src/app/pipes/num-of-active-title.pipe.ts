import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numOfActiveTitle'
})
export class NumOfActiveTitlePipe implements PipeTransform {

  transform(numOfActiveTodos: number | null): string {
    return numOfActiveTodos === 1 ? `${ numOfActiveTodos } item left` : `${ numOfActiveTodos } items left`;
  }

}
