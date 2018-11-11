import { Input, DatePicker, Switch,Form } from 'antd';

import {SessionContext} from '../../Application'
import {Language} from "../../const/ConstDefine";
import RefListField from '../../../components/Field/RefListField';
import RefTableField from '../../../components/Field/RefTableField';
import {Icon} from 'antd';

const { RangePicker} = DatePicker;
const FormItem = Form.Item;

const DisplayType = {
    text : "text",
    password : "password",
    //日期相关
    calendar : "calendar",
    calendarFromTo : "calendarFromTo",
    datetime : "datetime",
    datetimeFromTo: "datetimeFromTo",
    //选择框
    sysRefList: "sysRefList",
    userRefList: "userRefList",
    referenceTable: "referenceTable",
    //单选
    radio: "radio"
}

const NumberType = ["int", "double"];

const DisplaySelectType = [DisplayType.sysRefList, DisplayType.userRefList, DisplayType.referenceTable];

const Aligin = {
    left : "left",
    right : "right"
}

const DisplayLength = {
    min: 100,
    max: 300
}
export default class Field {

    displayFlag;
    queryFlag;
    mainFlag;
    basicFlag;
    
    objectRrn;
    name;
    dataType;
    label;
    labelZh;    
    labelRes;
    displayType;
    refListName;
    refTableName;
    defaultValue;
    tabRrn;
    displayLength;


    //验证栏位
    readonlyFlag;
    editable;
    requiredFlag;
    namingRule;
    queryRequireFlag;

    // 前端栏位
    title;
    placeHolder;
    disabled;

    constructor(field) {
        this.objectRrn = field.objectRrn;
        this.name = field.name;
        this.dataType = field.dataType;
        this.displayFlag = field.displayFlag;
        this.mainFlag = field.mainFlag;
        this.queryFlag = field.queryFlag;
        this.label = field.label;
        this.labelZh = field.labelZh;
        this.labelRes = field.labelRes;
        this.displayType = field.displayType;
        this.refListName = field.refListName;
        this.refTableName = field.refTableName;
        this.readonlyFlag = field.readonlyFlag;
        this.requiredFlag = field.requiredFlag;
        this.namingRule = field.namingRule;
        this.editable = field.editable;
        this.defaultValue = field.defaultValue;
        this.displayLength = field.displayLength;
        this.tabRrn = field.tabRrn;
        this.title = this.buildTitle();
        this.basicFlag = field.basicFlag;
        this.queryRequireFlag = field.queryRequireFlag;
    }

    //TODO 处理fixed和sorter
    buildColumn() {
        if (this.displayFlag && this.mainFlag) {
            // 文本靠左 数字靠右
            let aligin = Aligin.left;
            if (NumberType.includes(this.dataType)) {
                aligin = Aligin.right;
            }
            let column = {
                key: this.name,
                title: this.title,
                dataIndex: this.name,
                align: aligin,
                width: this.buildWidth()
                // fixed: 'left',
                // sorter: (a, b) => a.id - b.id
            }
            return column;
        }
        return null;
    }

    buildWidth = () => {
        let width = this.displayLength;
        if (width < DisplayLength.min) {
            width = DisplayLength.min;
        }
        if (width > DisplayLength.max) {
            width = DisplayLength.max;
        }
        return width;
    }

    isQueryField = () => {
        if (this.displayFlag && this.queryFlag) {
            return true;
        }
        return false;
    }

    buildTitle() {
        let title;
        let language = SessionContext.getLanguage();
        if (language == Language.Chinese) {
            title = this.labelZh;
        } else if (language == Language.English) {
            title = this.label;
        } else {
            title = this.labelRes;
        }
        return title;
    }

    /**
     * 根据不同的DisplayType创建不同的组件
     * //TODO 处理默认时间今天，以及默认时间为最后一个月
     */
    buildControl(edit) {
        this.buildDisabled(edit);
        if (this.displayType == DisplayType.text) {
            return <Input placeholder = {this.placeHolder} disabled={this.disabled}/>;
        } else if (this.displayType == DisplayType.password) {
            return <Input placeholder = {this.placeHolder} type="password" disabled={this.disabled}/>;
        } else if (this.displayType == DisplayType.calendar) {
            return <DatePicker disabled={this.disabled}/>
        } else if (this.displayType == DisplayType.calendarFromTo) {
            return <RangePicker disabled={this.disabled}/>
        } else if (this.displayType == DisplayType.datetime) {
            return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled={this.disabled}/>
        } else if (this.displayType == DisplayType.datetimeFromTo) {
            return <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled={this.disabled}/>
        } else if (this.displayType == DisplayType.sysRefList) {
            return <RefListField referenceName={this.refListName} disabled={this.disabled}/>
        } else if (this.displayType == DisplayType.userRefList) {
            return <RefListField referenceName={this.refListName} owner disabled={this.disabled}/>
        } else if (this.displayType == DisplayType.referenceTable) {
            return <RefTableField refTableName={this.refTableName} disabled={this.disabled}/>
        } else if (this.displayType == DisplayType.radio) {
            return <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} disabled={this.disabled}/>
        }
    }
    
    /**
     * 根据field类型不同创建不同的组件 以及规则
     * @param fieldDecorator form
     * @param formItemProperties form属性比如样式等
     * @param edit 是否是编辑form 编辑form会处理editable栏位
     * @param query 是否是queryForm queryForm的是否必输根据queryRequireFlag决定
     */
    buildFormItem = (fieldDecorator, formItemProperties, edit, query) => {
        //处理formItemPorperties TODO暂时不支持file上传组件检验
        if (formItemProperties == undefined) {
            formItemProperties = {};
        } 
        let valuePropName = "value";
        if (this.displayType == DisplayType.radio) {
            valuePropName = "checked";
        } 
        let rules = this.buildRule(query);
        return (<FormItem {...formItemProperties} label={this.title}>
            {fieldDecorator(this.name, {
                rules: rules,
                valuePropName: valuePropName,
            })
          (
            this.buildControl(edit)
          )}
        </FormItem>);
    }

    buildDisabled = (editor) => {
        if (this.readonlyFlag) {
            this.disabled = true;
            this.placeHolder = "";
        }
        // 当进行编辑(修改)对象的时候，判断其栏位是否是可编辑
        if (editor && !this.editable) {
            this.disabled = true;
            this.placeHolder = "";
        }
    }
    /**
     * 根据nbfield创建不同的规则rule
     *  只有当displayType为text才去检验规则，其他只处理是否只读
     * @param 是否是查询form生成。如果是则根据queryRequired来生成必输
     */
    buildRule(query) {
        let rules = [];

        let rule = {};
        rule.whitespace = true;
        if (this.requiredFlag) {
            rule.required = true;
        }
        if (query) {
            if (!this.queryRequireFlag) {
                rule.required = false;
            }
        }
        
        let defaultTransform = (value) => {
            if (value) {
                return value.toString();
            }
        };

        //根据dataType以及disPlayType处理transform
        if (this.displayType == DisplayType.text) {
            // 只有当text的时候才支持正则
            if (this.namingRule != null && this.namingRule != undefined) {
                rule.pattern = this.namingRule;
            }
        }

        if (DisplaySelectType.includes(this.displayType)) {
            rule.transform = defaultTransform();
        }

        if (DisplayType.radio == this.displayType) {
            rule.type = "boolean";
        }

         // 数字
        if (NumberType.includes(this.dataType)) {
            rule.type = "number";
            rule.transform = (value) => {
                if(value){
                    return Number(value);
                  }
            }
        }
        rules.push(rule);
        return rules;
    }
}