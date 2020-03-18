package com.newbiest.gc.rest.stockout;

import com.newbiest.base.exception.ClientException;
import com.newbiest.gc.rest.IncomingMaterialImport.IncomingMaterialImportRequest;
import com.newbiest.gc.service.GcService;
import com.newbiest.mms.model.MaterialLot;
import com.newbiest.mms.model.MaterialLotUnit;
import com.newbiest.msg.Request;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/gc")
@Slf4j
@Api(value="/gc", tags="gc客制化接口", description = "GalaxyCore客制化接口")
public class StockOutController {

    @Autowired
    GcService gcService;

    @ApiOperation(value = "StockOut", notes = "发货")
    @ApiImplicitParam(name="request", value="request", required = true, dataType = "StockOutRequest")
    @RequestMapping(value = "/stockOut", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
    public StockOutResponse execute(@RequestBody StockOutRequest request) throws Exception {
        StockOutResponse response = new StockOutResponse();
        response.getHeader().setTransactionId(request.getHeader().getTransactionId());

        StockOutResponseBody responseBody = new StockOutResponseBody();
        StockOutRequestBody requestBody = request.getBody();
        String actionType = requestBody.getActionType();

        if (StockOutRequest.ACTION_STOCKOUT.equals(actionType)) {
            gcService.stockOut(requestBody.getDocumentLine(), requestBody.getMaterialLotActions());
        } else if(StockOutRequest.ACTION_VALIDATION.equals(actionType)){
            gcService.validationStockOutMaterialLot(requestBody.getQueryMaterialLot(), requestBody.getMaterialLotActions());
        } else {
            throw new ClientException(Request.NON_SUPPORT_ACTION_TYPE + requestBody.getActionType());
        }

        response.setBody(responseBody);
        return response;
    }
}