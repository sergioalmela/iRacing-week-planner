import { duration } from 'moment';

export default [
  {
    // WoO Sprint Car
    seriesId: 307,
    everyTime: duration(2, 'hours'),
    offset: duration(30, 'minutes')
  },
  {
    // WoO Late Model
    seriesId: 308,
    everyTime: duration(2, 'hours'),
    offset: duration(90, 'minutes')
  },
  {
    // AMSoil Sprint
    seriesId: 309,
    everyTime: duration(2, 'hours'),
    offset: duration(105, 'minutes')
  },
];
