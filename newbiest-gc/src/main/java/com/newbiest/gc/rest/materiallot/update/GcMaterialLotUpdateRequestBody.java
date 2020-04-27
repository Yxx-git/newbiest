package com.newbiest.gc.rest.materiallot.update;

import com.newbiest.mms.model.MaterialLot;
import com.newbiest.msg.RequestBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;


@Data
@ApiModel("具体请求操作信息")
public class GcMaterialLotUpdateRequestBody extends RequestBody {
	
	private static final long serialVersionUID = 1L;

	@ApiModelProperty(value = "操作类型", example = "UpdateTreasuryNote/UpdateLocation")
	private String actionType;

	@ApiModelProperty(value = "物料批次")
	private List<MaterialLot> materialLotList;

	@ApiModelProperty("入库备注")
	private String treasuryeNote;

}
