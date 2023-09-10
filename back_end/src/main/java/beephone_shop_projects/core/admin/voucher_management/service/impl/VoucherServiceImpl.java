package beephone_shop_projects.core.admin.voucher_management.service.impl;

import beephone_shop_projects.core.admin.voucher_management.model.request.CreateVoucherRequest;
import beephone_shop_projects.core.admin.voucher_management.model.request.FindVoucherRequest;
import beephone_shop_projects.core.admin.voucher_management.model.request.UpdateVoucherRequest;
import beephone_shop_projects.core.admin.voucher_management.model.response.VoucherResponse;
import beephone_shop_projects.core.admin.voucher_management.repository.VoucherRepository;
import beephone_shop_projects.core.admin.voucher_management.service.VoucherService;
import beephone_shop_projects.entity.Voucher;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Validated
@Component
public class VoucherServiceImpl implements VoucherService {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 10;

    @Autowired
    private VoucherRepository voucherRepository;

    @Scheduled(fixedRate = 10000)
    public List<Voucher> updateStatusVoucher() {
        Date dateTime = new Date();
        List<Voucher> listToUpdate = new ArrayList<>();

        List<Voucher> list = voucherRepository.checkToStartAfterAndStatus(dateTime, 3);
        List<Voucher> list1 = voucherRepository.checkEndDateAndStatus(dateTime, 2);
        List<Voucher> list3 = voucherRepository.checkToStartBeforDateNowAndStatus(dateTime, 1);

        listToUpdate.addAll(list);
        listToUpdate.addAll(list1);
        listToUpdate.addAll(list3);

        for (Voucher v : listToUpdate) {
            if (list.contains(v)) {
                v.setTrangThai(3);
            }
            if (list1.contains(v)) {
                v.setTrangThai(2);
            }
            if (list3.contains(v)) {
                v.setTrangThai(1);
            }
        }
        return voucherRepository.saveAll(listToUpdate);
    }

    @Override
    public VoucherResponse getOne(String id) {
        return voucherRepository.getOneVoucher(id);
    }

    public String generateRandomCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            char randomChar = CHARACTERS.charAt(randomIndex);
            code.append(randomChar);
        }
        return code.toString();
    }

    @Override
    public Voucher addVoucher(@Valid CreateVoucherRequest request) {

        Voucher voucher = Voucher.builder()
                .ma(generateRandomCode())
                .ten(request.getTen())
                .dieuKienApDung(request.getDieuKienApDung())
                .giaTriToiDa(request.getGiaTriToiDa())
                .loaiVoucher(request.getLoaiVoucher())
                .soLuong(request.getSoLuong())
                .ngayBatDau(request.getNgayBatDau())
                .ngayKetThuc(request.getNgayKetThuc())
                .giaTriVoucher(request.getGiaTriVoucher())
                .trangThai(1)
                .build();
        return voucherRepository.save(voucher);
    }

    @Override
    public Voucher updateVoucher(@Valid UpdateVoucherRequest request, String id) {
        Voucher voucher = voucherRepository.findById(id).get();
        if (voucher != null) {
            voucher.setTen(request.getTen());
            voucher.setGiaTriToiDa(request.getGiaTriToiDa());
            voucher.setLoaiVoucher(request.getLoaiVoucher());
            voucher.setDieuKienApDung(request.getDieuKienApDung());
            voucher.setSoLuong(request.getSoLuong());
            voucher.setNgayBatDau(request.getNgayBatDau());
            voucher.setNgayKetThuc(request.getNgayKetThuc());
            voucher.setGiaTriVoucher(request.getGiaTriVoucher());
            return voucherRepository.save(voucher);
        }
        return null;
    }

    @Override
    public Boolean deleteVoucher(String id) {
        Voucher voucher = voucherRepository.findById(id).get();
        if (voucher != null) {
            voucherRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Boolean doiTrangThai(String id) {
        Voucher voucher = voucherRepository.findById(id).get();
        if (voucher != null) {
            voucherRepository.doiTrangThai(id);
            return true;
        }
        return false;
    }

    @Override
    public Page<Voucher> getAll(FindVoucherRequest request) {
        if (request.getPageNo() == null) {
            request.setPageNo(1);
        }
        if (request.getPageSize() == null) {
            request.setPageSize(5);
        }
        if (request.getKeyword() == null) {
            request.setKeyword("");
        }
        Pageable pageable = PageRequest.of(request.getPageNo() - 1, request.getPageSize());
        Page<Voucher> vouchers = voucherRepository.findAll(pageable, request);
        return vouchers;
    }

    @Override
    public String checkVoucher(String input) {
        if (input == null || input.isBlank()) {
            return null;
        } else {
            Voucher voucher = voucherRepository.findCodeVoucher(input);
            if (voucher != null) {
                if (voucher.getMa().equals(input) && voucher.getSoLuong() > 0 && voucher.getTrangThai() == 1) {
                    return "Found";
                } else if (!voucher.getMa().equals(input) || voucher.getTrangThai() != 1) {
                    return "Mã giảm giá " + input + " không tồn tại.";
                } else if (voucher.getMa().equals(input) && voucher.getSoLuong() <= 0) {
                    return "Hết lượt sử dụng.";
                } else {
                    return "Mã giảm giá " + input + " không tồn tại.";
                }
            } else {
                return "Mã giảm giá " + input + " không tồn tại.";
            }
        }
    }

    @Override
    public Page<Voucher> getVoucherStatusIsActive(FindVoucherRequest request) {
        if (request.getPageNo() == null) {
            request.setPageNo(1);
        }
        if (request.getPageSize() == null) {
            request.setPageSize(5);
        }
        if (request.getKeyword() == null) {
            request.setKeyword("");
        }
        Pageable pageable = PageRequest.of(request.getPageNo() - 1, request.getPageSize());
        return voucherRepository.getVoucherStatusIsActive(pageable,request);
    }
}
