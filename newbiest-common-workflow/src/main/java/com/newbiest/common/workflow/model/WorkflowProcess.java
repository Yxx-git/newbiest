package com.newbiest.common.workflow.model;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Created by guoxunbo on 2018/8/14.
 */
@Entity
@DiscriminatorValue(WorkflowDefinition.CATEGORY_TYPE_PROCESS)
public class WorkflowProcess extends WorkflowDefinition {

}
