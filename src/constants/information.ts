// 轮播图、公告的展示位置
export const informationPosition = {
  home: '首页',
  seckill: '抢购',
} as const;

export type InformationPosition = keyof typeof informationPosition;
