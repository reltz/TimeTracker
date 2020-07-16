import { Component, OnInit,  Input } from '@angular/core';

@Component({
  selector: 'app-list-card-name',
  templateUrl: './list-card-name.component.html',
  styleUrls: ['./list-card-name.component.scss']
})
export class ListCardNameComponent implements OnInit {
  
  @Input() id: string;

  constructor() { }

  public ngOnInit(): void {
    
  }

}
