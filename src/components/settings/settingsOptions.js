import * as styleHelpers from '@/helpers';

export const settingsOptions = [
  {
    name: 'Font Size',
    property: 'fontSize',
    type: 'range',
    min: 20,
    max: 30,
    default: 25,
    handler: styleHelpers.updateFontSize,
  },
  {
    name: 'Text Color',
    property: 'tableTextColor',
    type: 'color',
    default: '#000000',
    handler: styleHelpers.updateTableTextColor,
  },
  {
    name: 'Cell Color',
    property: 'tableCellColor',
    type: 'color',
    default: '#9fa5e1',
    handler: styleHelpers.updateTableCellColor,
  },
  {
    name: 'Background Color',
    property: 'backgroundColor',
    type: 'color',
    default: '#f7c6fd',
    handler: styleHelpers.updateBackgroundColor,
  },
];