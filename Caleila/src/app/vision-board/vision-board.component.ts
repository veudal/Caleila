import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vision-board',
  templateUrl: './vision-board.component.html',
  styleUrl: './vision-board.component.css',
  standalone: true,
  imports: [CommonModule]
})

export class VisionBoardComponent implements OnInit {
  selectedImage: string | null = null;

  ngOnInit() {
    const savedImage = localStorage.getItem("savedImage");
    if (savedImage)
      this.selectedImage = savedImage;
  }

  openFile() {
    document.querySelector('input')!.click();
  }

  onChange() {
    const input = document.querySelector('input')!;

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;

      localStorage.setItem("savedImage", this.selectedImage);
    }

    reader.readAsDataURL(input.files![0]);
  }
}
