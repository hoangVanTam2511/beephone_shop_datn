package beephone_shop_projects.core.admin.product_managements.controller;

import beephone_shop_projects.core.admin.product_managements.model.request.MauSacRequest;
import beephone_shop_projects.core.admin.product_managements.model.response.MauSacResponse;
import beephone_shop_projects.core.admin.product_managements.service.impl.MauSacServiceImpl;
import beephone_shop_projects.core.common.base.ResponseObject;
import beephone_shop_projects.entity.MauSac;
import beephone_shop_projects.infrastructure.constant.ApiConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ApiConstants.ApiSystems.API_COLOR_URI)
@CrossOrigin(origins = "http://localhost:3000")
public class MauSacController {

    @Autowired
    private MauSacServiceImpl mauSacService;

    @GetMapping
    public ResponseObject<List<MauSacResponse>> getMauSac() {
        List<MauSacResponse> mauSac = mauSacService.findAll();
        return new ResponseObject<>(mauSac);
    }

    @GetMapping("/{id}")
    public ResponseObject<MauSacResponse> getMauSacById(@PathVariable("id") String id) {
        MauSacResponse mauSac = mauSacService.findOneById(id);
        return new ResponseObject<>(mauSac);
    }

    @PostMapping
    public ResponseObject<MauSacResponse> createMauSac(@RequestBody MauSacRequest mauSacRequest) throws Exception {
        MauSacResponse createdMauSac = mauSacService.save(mauSacRequest);
        return new ResponseObject<>(createdMauSac);
    }


    @PutMapping("/{id}")
    public ResponseObject<MauSac> updateMauSac(@RequestBody MauSacRequest mauSacRequest, @PathVariable String id) throws Exception {
        MauSac update = mauSacService.updateMauSac(mauSacRequest, id);
        return new ResponseObject<>(update);
    }

    @PutMapping("/doi-trang-thai/{id}")
    public ResponseObject<MauSac> doiTrangThai( @PathVariable String id) throws Exception {
        MauSac delete = mauSacService.doiTrangThai(id);
        return new ResponseObject<>(delete);
    }
}
