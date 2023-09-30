package beephone_shop_projects.core.admin.voucher_management.model.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class CreateVoucherRequest {

    private String ma;

    private Integer trangThai;

    @NotBlank(message = "Không để trống Tên !!!")
    private String ten;

    private BigDecimal giaTriToiDa;

    @NotNull(message = "Không để trống Số Lượng !!!")
    private Integer soLuong;

    @NotNull(message = "Không để trống Điều Kiện Áp Dung")
    @Min(value = 0, message = "Giá Trị Tối Thiểu Là 0 !!!")
    private BigDecimal dieuKienApDung;

    private String loaiVoucher;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @FutureOrPresent(message = "Không chọn ngày quá khứ !!!")
    @NotNull(message = "Không để trống Ngày Bắt Đầu !!!")
    private Date ngayBatDau;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @FutureOrPresent(message = "Không chọn ngày quá khứ !!!")
    @NotNull(message = "Không để trống Ngày Kết Thúc !!!")
    private Date ngayKetThuc;

    @NotNull(message = "Không để trống giá trị Voucher !!!")
    @Min(value = 0, message = "Giá Trị Tối Thiểu Là 0 VNĐ !!!")
    @Max(value = 100000000, message = "Giá Trị Tối Đa là 1.000.000 VNĐ !!!")
    private BigDecimal giaTriVoucher;


//    public String getMa() {
//        return ma;
//    }
//
//    public void setMa(String ma) {
//        this.ma = ma;
//    }
//
//    public Integer getTrangThai() {
//        return trangThai;
//    }
//
//    public void setTrangThai(Integer trangThai) {
//        this.trangThai = trangThai;
//    }

}
