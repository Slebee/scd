import { forEach, findIndex } from 'lodash';

export default function(fieldsValue, fields) {
  const nextFieldsValue = {
    _t: Date.now(),
  };
  forEach(fieldsValue, (value, key) => {
    if (typeof value !== 'undefined' && value !== '') {
      const fieldTarget = fields[findIndex(fields, o => o.id === key)];
      const inputType = fieldTarget.type;
      let startFieldName;
      let endFieldName;
      switch (inputType) {
        case 'RangeMoneyInput':
          if (fieldTarget.ids) {
            // 如果配置了ids，则使用ids[0]作为起始字段,ids[1]作为结束字段
            [startFieldName, endFieldName] = fieldTarget.ids;
          } else {
            // 否则使用默认
            startFieldName = `${key}Min`;
            endFieldName = `${key}Max`;
          }
          nextFieldsValue[startFieldName] = value.min;
          nextFieldsValue[endFieldName] = value.max;

          break;
        case 'RangePicker':
          if (value.length !== 0) {
            if (fieldTarget.ids) {
              // 如果配置了ids，则使用ids[0]作为起始字段,ids[1]作为结束字段
              [startFieldName, endFieldName] = fieldTarget.ids;
            } else {
              // 否则使用默认
              startFieldName = `${key}StartDate`;
              endFieldName = `${key}EndDate`;
            }
            nextFieldsValue[startFieldName] = value[0].format('YYYY-MM-DD');
            nextFieldsValue[endFieldName] = value[1].format('YYYY-MM-DD');
          }
          break;
        default:
          nextFieldsValue[key] = value;
      }
    }
  });

  return nextFieldsValue;
}
