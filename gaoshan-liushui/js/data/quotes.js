/* ============================================================
   高山流水 · 金句题库（数据结构见技术设计文档 §4.2）
   weights: 每个金句对若干人格卡的权重（+1~+3）
   ============================================================ */
const QUOTES = [
  // ---- 知音 ----
  { id: "q001", text: "相识满天下，知心能几人", author: "《增广贤文》", category: "知音", weights: { boya: 2, zhongziqi: 2 } },
  { id: "q002", text: "高山流水，知音难觅", author: "伯牙子期", category: "知音", weights: { boya: 3, zhongziqi: 1 } },
  { id: "q003", text: "人生得一知己足矣，斯世当以同怀视之", author: "鲁迅", category: "知音", weights: { zhongziqi: 3, lindaiyu: 1 } },
  { id: "q004", text: "海内存知己，天涯若比邻", author: "王勃", category: "知音", weights: { sushi: 2, libai: 1 } },
  { id: "q005", text: "士为知己者死", author: "《战国策》", category: "知音", weights: { mengzi: 2, wangyangming: 2 } },
  // ---- 孤独 ----
  { id: "q006", text: "前不见古人，后不见来者", author: "陈子昂", category: "孤独", weights: { boya: 2, lindaiyu: 2 } },
  { id: "q007", text: "独坐幽篁里，弹琴复长啸", author: "王维", category: "孤独", weights: { wangwei: 3, jikang: 2 } },
  { id: "q008", text: "千山鸟飞绝，万径人踪灭", author: "柳宗元", category: "孤独", weights: { wangwei: 3, boya: 1 } },
  { id: "q009", text: "我本将心向明月，奈何明月照沟渠", author: "高明", category: "孤独", weights: { lindaiyu: 3, zhongziqi: 1 } },
  { id: "q010", text: "举世皆浊我独清，众人皆醉我独醒", author: "屈原", category: "孤独", weights: { boya: 2, mengzi: 1 } },
  // ---- 治愈 ----
  { id: "q011", text: "山重水复疑无路，柳暗花明又一村", author: "陆游", category: "治愈", weights: { sushi: 3, wangyangming: 1 } },
  { id: "q012", text: "莫愁前路无知己，天下谁人不识君", author: "高适", category: "治愈", weights: { sushi: 2, mengzi: 2 } },
  { id: "q013", text: "长风破浪会有时，直挂云帆济沧海", author: "李白", category: "治愈", weights: { libai: 3, sushi: 2 } },
  { id: "q014", text: "万物皆有裂痕，那是光照进来的地方", author: "莱昂纳德·科恩", category: "治愈", weights: { sushi: 2, lindaiyu: 2 } },
  { id: "q015", text: "世界以痛吻我，我要报之以歌", author: "泰戈尔", category: "治愈", weights: { sushi: 2, wangyangming: 2 } },
  // ---- 成长 ----
  { id: "q016", text: "知人者智，自知者明", author: "老子", category: "成长", weights: { laozi: 3, wangyangming: 2 } },
  { id: "q017", text: "路漫漫其修远兮，吾将上下而求索", author: "屈原", category: "成长", weights: { wangyangming: 3, mengzi: 2 } },
  { id: "q018", text: "不积跬步，无以至千里", author: "荀子", category: "成长", weights: { wangyangming: 3, taoyuanming: 1 } },
  { id: "q019", text: "学而不思则罔，思而不学则殆", author: "孔子", category: "成长", weights: { kongzi: 3, wangyangming: 1 } },
  { id: "q020", text: "博学之，审问之，慎思之，明辨之，笃行之", author: "《中庸》", category: "成长", weights: { kongzi: 3, wangyangming: 2 } },
  // ---- 自由 ----
  { id: "q021", text: "逍遥于天地之间，而心意自得", author: "庄子", category: "自由", weights: { zhuangzi: 3, jikang: 2 } },
  { id: "q022", text: "大鹏一日同风起，扶摇直上九万里", author: "李白", category: "自由", weights: { libai: 3, zhuangzi: 2 } },
  { id: "q023", text: "采菊东篱下，悠然见南山", author: "陶渊明", category: "自由", weights: { taoyuanming: 3, wangwei: 2 } },
  { id: "q024", text: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生", author: "苏轼", category: "自由", weights: { sushi: 3, zhuangzi: 1 } },
  { id: "q025", text: "人生在世不称意，明朝散发弄扁舟", author: "李白", category: "自由", weights: { libai: 3, zhuangzi: 2 } },
  { id: "q026", text: "不自由，毋宁死", author: "帕特里克·亨利", category: "自由", weights: { jikang: 3, zhuangzi: 2 } },
  { id: "q027", text: "生命诚可贵，爱情价更高；若为自由故，两者皆可抛", author: "裴多菲", category: "自由", weights: { jikang: 3, zhuangzi: 2 } },
  // ---- 热爱 ----
  { id: "q028", text: "生活明朗，万物可爱", author: "现代", category: "热爱", weights: { sushi: 2, libai: 2 } },
  { id: "q029", text: "热爱可抵岁月漫长", author: "现代", category: "热爱", weights: { sushi: 2, xinqiji: 2 } },
  { id: "q030", text: "众里寻他千百度，蓦然回首，那人却在灯火阑珊处", author: "辛弃疾", category: "热爱", weights: { xinqiji: 3, zhongziqi: 2 } },
  { id: "q031", text: "醉里挑灯看剑，梦回吹角连营", author: "辛弃疾", category: "热爱", weights: { xinqiji: 3, mengzi: 2 } },
  { id: "q032", text: "我见青山多妩媚，料青山见我应如是", author: "辛弃疾", category: "热爱", weights: { xinqiji: 3, zhuangzi: 2 } },
  { id: "q033", text: "心有猛虎，细嗅蔷薇", author: "西格里夫·萨松", category: "热爱", weights: { xinqiji: 3, lindaiyu: 1 } },
  { id: "q034", text: "此情可待成追忆，只是当时已惘然", author: "李商隐", category: "热爱", weights: { lindaiyu: 3, zhongziqi: 1 } },
  { id: "q035", text: "问世间情为何物，直教人生死相许", author: "元好问", category: "热爱", weights: { lindaiyu: 3, zhongziqi: 2 } },
  { id: "q036", text: "两情若是久长时，又岂在朝朝暮暮", author: "秦观", category: "热爱", weights: { zhongziqi: 3, lindaiyu: 2 } },
  { id: "q037", text: "苔花如米小，也学牡丹开", author: "袁枚", category: "热爱", weights: { taoyuanming: 2, mengzi: 2 } },
  { id: "q038", text: "天下兴亡，匹夫有责", author: "顾炎武", category: "热爱", weights: { mengzi: 3, wangyangming: 2 } },
  // ---- 成长（隐藏人格彩蛋） ----
  { id: "q039", text: "上善若水，水善利万物而不争", author: "老子", category: "成长", weights: { laozi: 3, zhuangzi: 2 } },
  { id: "q040", text: "三人行，必有我师焉", author: "孔子", category: "成长", weights: { kongzi: 3, taoyuanming: 1 } }
];

if (typeof module !== "undefined") module.exports = { QUOTES };
