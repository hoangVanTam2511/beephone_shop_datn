package beephone_shop_projects.core.admin.product_management.repository;

import beephone_shop_projects.core.admin.product_management.model.responce.CauHinhResponce;
import beephone_shop_projects.entity.CauHinh;
import beephone_shop_projects.repository.ICauHinhRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CauHinhRepository extends ICauHinhRepository {

    Page<CauHinh> findAll(Pageable pageable);

    @Query(value = """
                  SELECT a.id,
                     c.ten_mau_sac as'mau_sac',
                     e.kich_thuoc as 'kich_thuoc_ram',
                     f.kich_thuoc as 'kich_thuoc_rom',
                     spct.so_luong_ton_kho as 'so_luong',
                     spct.don_gia as 'don_gia',
                     imei.so_imei as 'imei',
                     spct.id_san_pham as 'id_san_pham'
                    FROM cau_hinh as a
                    JOIN mau_sac as c ON c.id = a.id_mau_sac
                    JOIN ram as e ON e.id = a.id_ram
                    JOIN rom as f ON f.id = a.id_rom
                    LEFT JOIN san_pham_chi_tiet as spct ON  spct.id_cau_hinh = a.id
                    LEFT JOIN imei ON imei.id_chi_tiet_san_pham = spct.id
                    WHERE a.delected = 1
                                                 
            """, nativeQuery = true)
    Page<CauHinhResponce> getAllCauHinh(Pageable pageable, @Param("delected") Boolean delected);


}
