package beephone_shop_projects.core.admin.order_management.model.request;

import beephone_shop_projects.entity.Chip;
import beephone_shop_projects.entity.CongSac;
import beephone_shop_projects.entity.Hang;
import beephone_shop_projects.entity.ManHinh;
import beephone_shop_projects.entity.Pin;
import beephone_shop_projects.entity.TheNho;
import beephone_shop_projects.entity.TheSim;
import beephone_shop_projects.infrastructure.constant.OperatingType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ProductRequest {

  private String ma;

  private String tenSanPham;

  private OperatingType operatingType;

  private List<TheSim> theSimDienThoais;

  private CongSac congSac;

  private String moTa;

  private Hang hang;

  private Chip chip;

  private TheNho theNho;

  private ManHinh manHinh;

  private Pin pin;

  private Integer trangThai;

}
