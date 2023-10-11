package beephone_shop_projects.core.admin.voucher_management.model.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class FindVoucherRequest {

    private String ma;

    private String ten;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date ngayBatDau;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date ngayKetThuc;

    private BigDecimal dieuKienApDung;

    private BigDecimal giaTriVoucher;

    private BigDecimal giaTriToiDa;

    private Integer soLuong;

    private String loaiVoucher;

    private Integer trangThai;

    private String keyword;

    private Integer pageNo;

    private Integer pageSize;

    private BigDecimal tongTien;

}
