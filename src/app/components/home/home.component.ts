import { Component } from '@angular/core';
import {NgOptimizedImage, NgStyle} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgStyle
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public lsCategories: {name: string, id: string}[] = [
    {name: 'Trang chủ', id: 'home'},
    {name: 'Sản phẩm', id: 'product'},
    {name: 'Feedback', id: 'feedback'},
    {name: 'Đăng ký', id: 'register'},
    {name: 'Liên hệ', id: 'contact'},
  ];
}
