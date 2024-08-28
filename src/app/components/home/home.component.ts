import {Component, ElementRef, inject, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgOptimizedImage, NgStyle} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

type ListFollowPack = {
  id?: number,
  url?: string,
  title?: string,
  content?: string,
  route?: string,
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgStyle,
    NgClass,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('dialogTempDoclapchocon', {static: true}) dialogTempDoclapchocon!: TemplateRef<HTMLElement>;
  @ViewChild('dialogTempChomevacon', {static: true}) dialogTempChomevacon!: TemplateRef<HTMLElement>;
  @ViewChild('dialogTempAnphuchungthinh', {static: true}) dialogTempAnphuchungthinh!: TemplateRef<HTMLElement>;
  @ViewChild('dialogTempCagiadinh', {static: true}) dialogTempCagiadinh!: TemplateRef<HTMLElement>;
  private ggLink: string = 'https://docs.google.com/forms/d/e/1FAIpQLSelkFzaEdmt789nIg65ptYiqBJAebf3IyVETeG9WqCqTNrfXA/formResponse?submit=Submit?usp=pp_url';
  private countdownElement!: HTMLElement;
  private intervalId!: number;
  public reactiveForm: FormGroup;
  public endDate = new Date();
  public timeNow = new Date();
  public lsCategories: { name: string, href: string }[] = [
    // {name: 'Trang chủ', id: 'home'},
    // {name: 'Sản phẩm', id: 'product'},
    // {name: 'Feedback', id: 'feedback'},
    // {name: 'Đăng ký', id: 'register'},
    // {name: 'Liên hệ', id: 'contact'},
    {name: 'Trang chủ', href: 'home'},
    {name: 'Sản phẩm', href: 'product'},
    {name: 'Feedback', href: 'feedback'},
    {name: 'Đăng ký', href: 'register-form'},
    {name: 'Liên hệ', href: 'contact'},
  ];

  public lsExperience: { name: string, value: string, value2?: string }[] = [
    {name: '8 năm', value: 'Trong ngành BHNT, xử lý bồi thường nhanh 24/24.'},
    {name: '500 KH', value: 'Hiện đang chăm sóc 500 khách hàng trên toàn quốc.'},
    {name: 'top 1', value: 'Top 1 tư vấn khu vực HB', value2: 'Top 5 tư vấn xuất sắc nhất toàn quốc.'},
  ];

  public lsImagesCarousel: { url: string, alt: string }[] = [
    {url: './assets/img/img.png', alt: 'bảo vệ người trụ cột chính trong gia đình'},
    {url: './assets/img/img1.png', alt: 'bảo vệ thu nhập khi rủi ro bệnh tật'},
    {url: './assets/img/img2.png', alt: 'quỹ tiết kiệm tài chính có kỷ luật cho gia đình'},
    {url: './assets/img/img3.png', alt: 'chăm sóc sức khỏe với dịch vụ cao cấp hơn'},
    {url: './assets/img/img4.png', alt: 'chăm sóc sức khỏe với dịch vụ cao cấp hơn'},
  ];

  public lsImages: { url: string, content: string }[] = [
    {url: './assets/img/img_1.png', content: 'bảo vệ người trụ cột chính trong gia đình'},
    {url: './assets/img/img_2.png', content: 'bảo vệ thu nhập khi rủi ro bệnh tật'},
    {url: './assets/img/img_3.png', content: 'quỹ tiết kiệm tài chính có kỷ luật cho gia đình'},
    {url: './assets/img/img_4.png', content: 'chăm sóc sức khỏe với dịch vụ cao cấp hơn'},
  ];

  public reasonParagraph: string = 'Bạn luôn mong ước một cuộc sống bình yên. Tuy nhiên, cuộc sống đôi khi lại mang đến những điều không mong\n' +
    '            đợi. Tử vong, bệnh hiểm nghèo hay tai nạn đều có thể xảy ra cho bất cứ ai, bất cứ nơi nào và tài chính sẽ là\n' +
    '            vấn đề nan giải nếu bạn không hoạch định trước. Bảo hiểm nhân thọ Dai-Ichi Life là giải pháp tài chính toàn\n' +
    '            diện của chúng tôi nhằm mang đến cho bạn và gia đình bạn sự bảo vệ, quyền lợi và giá trị tốt nhất.';
  public reasonTitle: string = 'những lý do nên chọn khi tham gia bảo hiểm nhân thọ';
  public lsReasonParagraph: { title: string }[] = [
    {title: 'Bù đắp thu nhập khi người trụ cột vắng mặt.'},
    {title: 'Thanh toán chi phí khi không may mắc phải những bệnh nan y, hiểm nghèo, tai nạn hoặc rủi ro.'},
    {title: 'Chăm sóc sức khoẻ toàn diện, bảo lãnh viện phí tại các bệnh viện quốc tế hàng đầu trên cả nước.'},
    {title: 'Thời gian giải quyết thủ tục chi trả bảo hiểm nhanh chóng.'},
  ];
  public followPacks: string = 'các gói bảo hiểm được quan tâm nhất';
  public feedback: string = 'feedback khách hàng';
  public signature: string = 'hình ảnh cô Liên ký hợp đồng và cskh';
  public player: string = 'ca sĩ, diễn viên sử dụng bảo hiểm';
  public chosseMe: string = 'những lý do chính bạn nên chọn';
  public news: string = 'tin tức & sự kiện';
  public customer: string = 'đối tác của chúng tôi';
  public sale: string = 'đăng ký tư vấn';
  public lsChosseMe: { title: string }[] = [
    {title: 'Thủ tục bảo lãnh thuận tiện, thanh toán bồi thường nhanh gọn tại tất cả các bệnh viện từ tuyến huyến đến viện QT: Nhi Tw, Hồng Ngọc, Vinmec, Việt Pháp, 108...'},
    {title: 'Thanh toán Claim trong vòng 24h.'},
    {title: 'Phục vụ 24/7 trong suốt quá trình tham gia BH.'},
    {title: 'Dùng thử không mất phí trong vòng 21 ngày.'},
    {title: 'Kiến thức chuyên sâu và kinh nghiệm trong nghành bảo hiểm nhân thọ Việt Nam.'},
    {title: 'Cam kết hỗ trợ khách hàng trước – trong – và sau khi tham gia bảo hiểm.'},
    {title: 'Cam kết tư vấn trung thực cho bạn cái nhìn hoàn toàn khách quan về bảo hiểm nhân thọ.'},
    {title: 'Cam kết đồng hành trọn đời cùng khách hàng.'},
    {title: 'Cam kết đặt lợi ích khách hàng lên hàng đầu là tôn chỉ làm việc của chúng tôi.'},
  ];
  public lsNews: ListFollowPack[] = [
    {
      id: 1,
      url: './assets/img/img_27.png',
      title: 'Sử dụng app ngay - nhận điểm thưởng',
      route: 'https://dai-ichi-life.com.vn/hoat-dong-kinh-doanh-15/daiichi-life-viet-nam-ra-mat-ung-dung-daiichi-connect-467'
    },
    {
      id: 2,
      url: './assets/img/img_28.png',
      title: 'Công cụ lập kế hoạch bảo hiểm',
      route: 'https://dai-ichi-life.com.vn/hoat-dong-kinh-doanh-15/dai-ichi-life-viet-nam-ra-mat-cong-cu-lap-ke-hoach-bao-hiem-2685'
    },
    {
      id: 3,
      url: './assets/img/img_29.png',
      title: 'Hợp tác chiến lược với Garmin',
      route: 'https://suckhoedoisong.vn/dai-ichi-life-viet-nam-ky-hop-tac-chien-luoc-voi-garmin-169231130095954492.htm'
    },
    {
      id: 4,
      url: './assets/img/img_30.png',
      title: 'Đem ánh sáng cho người nghèo',
      route: 'https://dai-ichi-life.com.vn/hoat-dong-cong-dong-16/dai-ichi-life-viet-nam-tiep-tuc-trien-khai-chuong-trinh-phau-thuat-mat-dem-anh-sang-cho-nguoi-ngheo-2024-tai-tay-ninh-2732'
    },
  ];
  public lsFollowPacks: ListFollowPack[] = [
    {
      id: 1,
      url: './assets/img/img_6.png',
      title: 'gói bh độc lập cho con',
      content: 'Khi gia đình của bạn có thêm sự hiện diện của các thiên thần nhỏ, bạn sẽ dành mọi tình yêu thương, quan tâm cho con thân yêu của mình và luôn mong muốn dành cho con những điều tốt đẹp nhất'
    },
    {
      id: 2,
      url: './assets/img/img_7.png',
      title: 'gói bh cho mẹ/ba và con',
      content: 'Một gia đình hạnh phúc khởi nguồn từ sự yêu thương và sức khỏe dồi dào của các thành viên trong gia đình. Song thật khó thảnh thơi về chi phí y tế khi bệnh tật thường đến không báo trước.'
    },
    {
      id: 3,
      url: './assets/img/img_8.png',
      title: 'gói bh an phúc hưng thịnh toàn diện',
      content: 'Ngoài các quyền lợi về bảo hiểm còn là sản phẩm bảo hiểm liên kết đầu tư, giúp bảo vệ tài chính vững chắc cho hiện tại và mang đến cơ hội tích lũy đầu tư, gia tăng tài sản hiệu quả cho tương lai.'
    },
    {
      id: 4,
      url: './assets/img/img_9.png',
      title: 'gói bh cho gia đình',
      content: 'Gia đình là tổ ấm, là nơi nuôi dưỡng và gắn kết các thành viên bằng tình cảm thiêng liêng. Để gìn giữ cuộc sống hạnh phúc, yêu thương không chỉ dừng lại ở lời nói mà còn là sự đảm bảo...'
    },
  ];

  public lsFeedbacks: { url: string, lock: boolean }[] = [
    {url: './assets/img/img_10.jpg', lock: false},
    {url: './assets/img/img_11.png', lock: false},
    {url: './assets/img/img_12.png', lock: false},
    {url: './assets/img/img_13.png', lock: false},
    {url: './assets/img/img_14.png', lock: false},
    {url: './assets/img/img_15.png', lock: false},
    {url: './assets/img/img_16.png', lock: false},
    {url: './assets/img/img_17.png', lock: true},
  ];

  public lsSignature: { url: string }[] = [
    {url: './assets/img/img_18.png'},
    {url: './assets/img/img_19.png'},
    {url: './assets/img/img_20.png'},
    {url: './assets/img/img_21.png'},
    {url: './assets/img/img_22.png'},
    {url: './assets/img/img_23.png'},
  ];

  public lsCustomer: { url: string }[] = [
    {url: './assets/img/phuongdong.png'},
    {url: './assets/img/hongngoc.jpg'},
    {url: './assets/img/hungviet.jpg'},
    {url: './assets/img/medlatec.jpg'},
    {url: './assets/img/vinmec.jpg'},
    {url: './assets/img/tamanh.jpg'},
    {url: './assets/img/phuongdong.png'},
    {url: './assets/img/hongngoc.jpg'},
    {url: './assets/img/hungviet.jpg'},
    {url: './assets/img/medlatec.jpg'},
    {url: './assets/img/vinmec.jpg'},
    {url: './assets/img/tamanh.jpg'},
    {url: './assets/img/hungviet.jpg'},
    {url: './assets/img/medlatec.jpg'},
    {url: './assets/img/phuongdong.png'},
  ];

  public lsInfor: { paragraph: string }[] = [
    {
      paragraph: 'Sau khi nhận được thông tin của bạn. Chúng tôi sẽ gọi lại cho bạn để xác nhận và lên lịch hẹn với bạn. Để chủ động hơn về thời gian của cả bạn và chúng tôi.'
    },
    {
      paragraph: 'Chúng tôi cần một số thông tin của bạn để thiết kế gói bảo hiểm. Hãy điền vào bảng đăng ký thông tin bên dưới. Thông tin của bạn được bảo mật 100%.'
    }
  ];

  public lsAddress: { icon: SafeHtml | string, title: string }[] = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 24 24" fill="#051F4D"> <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path> </svg>`,
      title: 'Địa chỉ: Đường Trần Hưng Đạo, Phường Quỳnh Lâm, thành phố Hoà Bình'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 24 24" fill="#051F4D"> <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"></path> </svg>',
      title: `Điện thoại: <a href="tel:0973903463">097.390.3463</a>`
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 24 24" fill="#051F4D"> <path d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V8L12,13L20,8V18M20,6L12,11L4,6V6H20V6Z"></path> </svg>',
      title: `<a href="mailto:voliendaiichi1989@gmail.com">voleindaiichi1989@gmail.com</a>`
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 24 24" fill="#051F4D"> <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"></path> </svg>',
      title: `<a href="https://voliendaiichi.vercel.app/volien-daiichi">https://voliendaiichi.vercel.app/volien-daiichi</a>`
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 18 18">\n' +
        '  <path d="M8.7495,1.50375C4.965,1.6275,1.7805,4.68825,1.51875,8.466C1.2765,12.49275,4.0815,16.374,8.0565,17.44125v-5.595h-2.079 c-0.58875,0-1.0515-0.47025-1.0515-1.0515v0c0-0.58875,0.47025-1.0515,1.0515-1.0515h1.29075v-1.3995 c0-2.31675,1.12875-3.3335,3.054-3.3335c0.28575,0,0.5295,0.006,0.73675,0.01575c0.50925,0.02475,0.903,0.44875,0.903,0.9585 v0c0,0.53025-0.42975,0.96-0.96,0.96h-0.3535c-0.81775,0-1.10325,0.77525-1.10325,1.64875v1.14975h1.496 c0.47275,0,0.8345,0.4215,0.7625,0.88875l-0.0865,0.561c-0.0585,0.376-0.3815,0.654-0.7625,0.654h-1.4095v5.79775 C14.725,15.927,18,12.7965,18,9C18,4.7745,13.00575,1.3665,8.7495,1.50375z"></path>\n' +
        '</svg>\n',
      title: `<a href="https://www.facebook.com/profile.php?id=100009359682242">Fb: Võ Liên Dai-ichi  (Siêu thị Bảo Hiểm)</a>`
    }
  ];
  private readonly dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, private http: HttpClient, private el: ElementRef,private sanitizer: DomSanitizer, private render: Renderer2) {
    this.endDate.setHours(23, 59, 59, 999);
    // name: 1182818327
    // sdt: 1361392576
    // diachi: 775420545
    this.reactiveForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      address: [''],
    });

    this.lsAddress = this.lsAddress.map(d => {
      return({
        icon: this.sanitizer.bypassSecurityTrustHtml(d.icon as string),
        title: d.title,
      })
    });
    this.countdownElement = this.el.nativeElement.querySelector(".demo-time");
  }

  get name(): FormControl {
    return this.reactiveForm.get('name') as FormControl;
  }

  get phone(): FormControl {
    return this.reactiveForm.get('phone') as FormControl;
  }

  ngOnInit() {
    // setInterval(() => this.timeNow = new Date(), 1000);
  }

  private startCountdown(date: string): void{
    const endTime = new Date(date).getTime();
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24;

    // this.updateCountdown(endTime, day, hour, minute, second);
    this.intervalId = setInterval(() => this.updateCountdown(endTime, day, hour, minute, second), 1000) as unknown as number;
  }

  public updateCountdown(endTime: number, day: number, hour: number, minute: number, second: number): void{
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      if(this.countdownElement){
        this.render.setProperty(this.countdownElement, 'textContent', 'Time left');
      }
      clearInterval(this.intervalId);
      return;
    }

    const days = Math.floor(timeLeft / (day));
    const hours = Math.floor((timeLeft % (day)) / (hour));
    const minutes = Math.floor((timeLeft % (hour)) / (minute));
    const seconds = Math.floor((timeLeft % (minute)) / second);
    const countdownElement = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if(this.countdownElement){
      this.render.setProperty(this.countdownElement, 'textContent', countdownElement);
    }
  }


  public sendInfo(): void {
    this.reactiveForm.markAllAsTouched();
    if (this.reactiveForm.invalid) return;
    const formData = this.reactiveForm.getRawValue();
    const newUrl = `${this.ggLink}&entry.2014677168=${formData.name}&entry.1883460066=${formData.phone}&entry.1722791753=${formData.address}`;
    fetch(newUrl).then();
    alert("Cảm ơn bạn đã để lại thông tin. Võ Liên sẽ liên hệ lại với mình sớm nhất nhé ^^");
    this.reactiveForm.reset();
  }

  public openDialog(item: ListFollowPack): void {
    switch (item.id) {
      case 1:
        this.dialog.open(this.dialogTempDoclapchocon, {
          width: '650px',
          height: '520px',
        });
        return;
      case 2 :
        this.dialog.open(this.dialogTempChomevacon, {
          width: '650px',
          height: '520px',
        });
        return;
      case 3:
        this.dialog.open(this.dialogTempAnphuchungthinh, {
          width: '650px',
          height: 'auto',
        });
        return;
      case 4:
        this.dialog.open(this.dialogTempCagiadinh, {
          width: '650px',
          height: '520px',
        });
        return;
      default:
        return;
    }
  }

  public scrollTo(element: string): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });

    this.removeClass();
  }

  public navigateBy(link: string | undefined): void {
    if (link) {
      window.open(link);
    }
  }

  public addClass(): void{
    const menuMobile = this.el.nativeElement.querySelector(".menu-mobile");
    const overlay = this.el.nativeElement.querySelector(".overlay-menu");
    this.render.addClass(menuMobile, 'show');
    this.render.addClass(overlay, 'opened');
  }

  public removeClass(): void {
    const menuMobile = this.el.nativeElement.querySelector(".menu-mobile");
    const overlay = this.el.nativeElement.querySelector(".overlay-menu");
    this.render.removeClass(menuMobile, 'show');
    this.render.removeClass(overlay, 'opened');
  }
}
