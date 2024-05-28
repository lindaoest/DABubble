import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  allMembers:Boolean = false;

  constructor() { }
}
