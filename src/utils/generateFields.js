import React from 'react';
import { Input, Form, Col, Radio, DatePicker } from 'antd';
import AsyncSelect from '@/components/AsyncSelect';
import Select from '@/components/Select';
import SearchSelect from '@/components/SearchSelect';
import RangeMoneyInput from '@/components/RangeMoneyInput';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const fieldComponents = {
  Input,
  AsyncSelect,
  SearchSelect,
  RadioGroup,
  TextArea,
  RangeMoneyInput,
  Select,
  RangePicker,
};
const defaultFormItemSetting = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const COL_SPAN = 8;

export default (form, ...args) => {
  let fields;
  /**
   * field
   * {
   *   id,
   *   formItemOptions: {
   *
   *   },
   *   options: {
   *
   *   }
   * }
   * */
  if (Array.isArray(args[0])) {
    fields = [...args[0]];
  } else {
    fields = [...args];
  }
  return fields.map(item => {
    const Component = fieldComponents[item.type] || Input;
    const formItemOptions = {
      ...defaultFormItemSetting,
      ...item.formItemOptions,
    };
    const onChange =
      item.componentOptions && item.componentOptions.onChange
        ? e => {
            item.componentOptions.onChange(e, form);
          }
        : undefined;
    return (
      <Col key={item.id} span={item.span || COL_SPAN}>
        <FormItem {...formItemOptions}>
          {form.getFieldDecorator(item.id, item.decoratorOptions)(
            <Component style={{ width: '100%' }} {...item.componentOptions} onChange={onChange} />
          )}
        </FormItem>
      </Col>
    );
  });
};

// 遍历fields，根据 field id匹配 initialValues对象赋默认值
export function getFieldsWithInitialValues(fields, initialValues) {
  return fields.map(item => ({
    ...item,
    decoratorOptions: {
      ...item.decoratorOptions,
      initialValue: initialValues[item.id] || undefined,
    },
  }));
}
