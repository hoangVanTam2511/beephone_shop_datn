package beephone_shop_projects.core.admin.product_managements.controller;

import beephone_shop_projects.core.admin.product_managements.model.request.TheNhoRequest;
import beephone_shop_projects.core.admin.product_managements.model.response.TheNhoResponse;
import beephone_shop_projects.core.admin.product_managements.service.impl.TheNhoServiceImpl;
import beephone_shop_projects.core.common.base.ResponseObject;
import beephone_shop_projects.infrastructure.constant.ApiConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ApiConstants.ApiSystems.API_THE_NHO_URI )
@CrossOrigin(origins = "http://localhost:3000")
public class TheNhoController {

    @Autowired
    private TheNhoServiceImpl theNhoService;

    @GetMapping
    public ResponseObject<List<TheNhoResponse>> getTheNho() {
        List<TheNhoResponse> theNho = theNhoService.findAll();
        return new ResponseObject<>(theNho);
    }

    @PostMapping
    public ResponseObject<TheNhoResponse> createTheNho(@RequestBody TheNhoRequest theNhoRequest) throws Exception {
        TheNhoResponse createdTheNho = theNhoService.save(theNhoRequest);
        return new ResponseObject<>(createdTheNho);
    }

}
