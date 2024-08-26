import {Component, inject, TemplateRef} from '@angular/core';
import {DatePipe, NgClass, NgOptimizedImage, NgStyle} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private ggLink: string = 'https://docs.google.com/forms/u/0/d/16ydbCsZZsjrWYoxRzFokT42HsuqEAL7QRBRi_Po1s3k/prefill';
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
    {name: 'Đăng ký', href: 'register'},
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
      title: 'gói bh cho mẹ và con',
      content: 'Một gia đình hạnh phúc khởi nguồn từ sự yêu thương và sức khỏe dồi dào của các thành viên trong gia đình. Song thật khó thảnh thơi về chi phí y tế khi bệnh tật thường đến không báo trước.'
    },
    {
      id: 3,
      url: './assets/img/img_8.png',
      title: 'gói bh cho ba và con',
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

  private readonly dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.endDate.setHours(23, 59, 59, 999);
    // name: 1182818327
    // sdt: 1361392576
    // diachi: 775420545
    this.reactiveForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,12}$/)]],
      address: [''],
    });
  }

  public sendInfo(): void {
    const body = this.reactiveForm.getRawValue();
    const payload = new URLSearchParams();
    payload.set('entry.1182818327', body.name);
    payload.set('entry.1361392576', body.phone);
    payload.set('entry.775420545', body.address);

    this.http.post(this.ggLink, payload.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).subscribe({
      next: res => {
        alert('Thông tin đã gửi thành công!');
        this.reactiveForm.reset();
      },
      error: err => {
        alert('Đã xảy ra lỗi gửi thông tin!');
      }
    });
  }

  public openDialog(item: ListFollowPack, dialog: TemplateRef<unknown>): void {
    this.dialog.open(dialog, {
      width: '500px',
      data: item,
    });
  }

  public scrollTo(element: string): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  public navigateBy(link: string | undefined): void {
    if (link) {
      window.open(link);
    }
  }
}
