import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  public dismiss(){
    this.modalController.dismiss();
  }

}
