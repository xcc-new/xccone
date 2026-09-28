/* ===== 名表验真 · 品牌数据库 =====
 * 核心事实：除少数品牌外，绝大多数高端腕表品牌【没有公开的"输序列号在线查真假"功能】。
 * 真实可靠的验证路径只有三类：
 *   ① 官方在线验证（仅个别品牌提供，见 onlineVerify）
 *   ② 官方授权服务中心 / 官方送检检测（主流方式，官方接受维修服务=强验证）
 *   ③ 权威第三方鉴定机构（中检CCIC、国家钟表质检中心、专业中介云鱼/徐步天）
 * 每个品牌的字段：
 *   name / en / origin / tier        —— 基础信息
 *   primary                          —— 主验证路径：'online' 官方在线 | 'service' 官方送检 | 'third' 第三方权威
 *   onlineVerify                     —— 官方在线验证能力（如实）
 *   onlineUrl / onlineName           —— 若官方在线可查，给出入口说明
 *   bestPath                         —— 最有效的验证路径（给用户的一句话动作）
 *   serial                           —— 序列号核对要点
 *   service                          —— 官方送检 / 服务中心渠道
 *   note                             —— 补充备注
 * ============================================================ */

const WATCH_GROUPS = [
  {
    id: 'haute',
    name: '顶奢级 · 高级制表',
    subtitle: '超级复杂功能与高定工艺，单价常数十万起，仿品极少但骗局更隐蔽',
    brands: [
      {
        name: '百达翡丽',
        en: 'PATEK PHILIPPE',
        origin: '瑞士 · 日内瓦',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '送官方认证服务中心 / 官方认可的维修师检测，官方证书（PP封条、出生纸）与表身号码必须完全一致。二手指定平台多为"先鉴定后放款"模式。',
        serial: '序列号刻于表壳背盖，与"出生纸"（Origin Certificate）证书号码必须一一对应；表盘工艺极细，仿品机芯走时与打磨难复制。',
        service: '通过品牌官方网站的授权服务中心送检，或由官方认可的独立维修师出具检测结论。',
        note: 'PP 官方对来源存疑的腕表不提供公开鉴定，但接受通过官方渠道进行验证服务。'
      },
      {
        name: '江诗丹顿',
        en: 'VACHERON CONSTANTIN',
        origin: '瑞士 · 日内瓦',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方授权精品店 / 服务中心检测，机芯序列号与保修文件核对一致；"黄金比例"外观仿品难还原。',
        serial: '序列号刻于表壳或机芯夹板，与保修卡、证书号码一致；马耳他十字标识做工精细。',
        service: '通过江诗丹顿精品店或官方客服预约送检。',
        note: '仿冒成本极高，主要防"贴牌改装"与假证书。'
      },
      {
        name: '爱彼',
        en: 'AUDEMARS PIGUET',
        origin: '瑞士 · 勒布拉叙',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '皇家橡树等热门款仿品较多，送官方服务中心 / 授权零售商检测最稳妥。',
        serial: '序列号刻于后盖内圈或表壳，八角表圈、一体化链带做工是判断要点。',
        service: '通过爱彼官方服务中心或授权专柜预约检测。',
        note: '热门款（如皇家橡树）为仿冒重灾区。'
      },
      {
        name: '宝珀',
        en: 'BLANCPAIN',
        origin: '瑞士 · 勒布拉叙',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，机芯编号与证书一致；五十噚潜水表旋入式表冠、排氦阀为判点。',
        serial: '序列号刻于后盖，与保卡、证书对应。',
        service: '通过宝珀授权服务中心送检。',
        note: '五十噚系列仿品相对常见，注意机芯刻印与防水结构。'
      },
      {
        name: '积家',
        en: 'JAEGER-LECOULTRE',
        origin: '瑞士 · 勒桑捷',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，Master 系列机芯打磨精细，仿品机芯一眼可辨。',
        serial: '序列号刻于后盖，与保卡一致。',
        service: '通过积家官方服务中心 / 精品店送检。',
        note: '机芯自制率高，仿品多在机芯与印刻上露馅。'
      },
      {
        name: '朗格',
        en: 'A. LANGE & SÖHNE',
        origin: '德国 · 格拉苏蒂',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，德国银夹板、蓝钢螺丝、鹅颈微调等工艺仿品无法复刻。',
        serial: '序列号刻于机芯夹板，与官方证书一致。',
        service: '通过朗格官方服务中心送检。',
        note: '德系顶级，工艺门槛极高，真伪主要靠专业鉴定。'
      },
      {
        name: '格拉苏蒂原创',
        en: 'GLASHÜTTE ORIGINAL',
        origin: '德国 · 格拉苏蒂',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，德式机芯（3/4夹板、鹅颈微调）特征明显。',
        serial: '序列号刻于机芯，与保卡一致。',
        service: '通过格拉苏蒂原创官方服务中心送检。',
        note: '与朗格同源格拉苏蒂，工艺风格相近。'
      },
      {
        name: '宝玑',
        en: 'BREGUET',
        origin: '瑞士 · 瑞士汝山谷',
        tier: '顶奢级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，宝玑针、钱币纹表壳、独立编号为辨识要素。',
        serial: '每枚宝玑表均有独立编号，刻于表盘或后盖。',
        service: '通过宝玑官方精品店 / 服务中心送检。',
        note: '独立编号是宝玑的招牌，假表常编造不存在的编号。'
      }
    ]
  },
  {
    id: 'luxury',
    name: '豪华级 · 经典名表',
    subtitle: '销量与仿冒量均最高的区间，几乎所有热门款都需谨慎核验',
    brands: [
      {
        name: '劳力士',
        en: 'ROLEX',
        origin: '瑞士 · 日内瓦',
        tier: '豪华级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '送到官方授权服务中心（RSC）做一次服务评估——官方愿意接收维修即是最强验证；官方拒绝服务的基本为假表或重大改装。',
        serial: '序列号刻于表圈内圈（新款6点位）或6点位表耳间（旧款）；必须与绿色保修卡号码一字不差。刻字应深、锐、间距均匀。',
        service: '官网查询授权服务中心地址，或通过劳力士客服预约送检。',
        note: '2021年后新卡为带芯片+二维码的绿色卡片；劳力士为全球仿冒最重灾区，务必走官方或权威鉴定。'
      },
      {
        name: '欧米茄',
        en: 'OMEGA',
        origin: '瑞士 · 比尔',
        tier: '豪华级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方授权门店 / 服务中心检测。核心看三处一致：机芯序列号、表壳序列号、保修卡序列号（8位数字或7位字母数字）——三者完全吻合。',
        serial: '序列号常冲压于表壳爪背后/后盖，极其微小清晰；假表序列号常只有表壳一处、机芯对不上。',
        service: '通过欧米茄官网的顾客服务入口，或授权专柜送检。',
        note: '保修卡完整填写（序列号+型号+购买日期+零售商）是正品重要凭证。'
      },
      {
        name: '卡地亚',
        en: 'CARTIER',
        origin: '法国 · 巴黎',
        tier: '豪华级',
        primary: 'online',
        onlineVerify: '官方提供序列号在线核验：输入序列号可注册 / 查询腕表信息',
        verifyEntry: 'https://cartiercare.cartier.cn/zh-cn/register/manual',
        verifyEntryNote: '进入卡地亚 Care 中国区 → Register / 输入序列号，可查询并注册腕表；Enquirus 库另可查失窃/登记状态。',
        bestPath: '先在官方 Enquirus 库登记并核验序列号状态，再送卡地亚精品店 / 授权门店检测。官方只对专柜/授权渠道购买者提供鉴定。',
        serial: '序列号刻于后盖；输入后应能查到对应型号、尺寸、材质信息，查不到或对不上则为假表。',
        service: '卡地亚精品店 / 授权门店，或官网 Request a Service 入口。',
        note: 'Enquirus 主要用于防盗与状态登记，官方对非授权渠道购表不提供鉴定结论。'
      },
      {
        name: '万国',
        en: 'IWC',
        origin: '瑞士 · 沙夫豪森',
        tier: '豪华级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，序列号与保修卡一致；葡萄牙系列机芯打磨、字面做工为判点。',
        serial: '序列号刻于后盖，与保卡对应。',
        service: '通过万国官方服务中心 / 授权专柜送检。',
        note: '飞行员、葡萄牙系列为热门仿冒款。'
      },
      {
        name: '沛纳海',
        en: 'PANERAI',
        origin: '意大利 · 佛罗伦萨',
        tier: '豪华级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，独特护桥、三明治表盘工艺是辨识要点。',
        serial: '序列号刻于后盖，与保卡一致。',
        service: '通过沛纳海官方服务中心送检。',
        note: '风格辨识度高，但仿品量大，注意机芯与护桥细节。'
      },
      {
        name: '百年灵',
        en: 'BREITLING',
        origin: '瑞士 · 格伦兴',
        tier: '豪华级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，滑尺表圈、机芯刻印为判点。',
        serial: '序列号刻于后盖或表耳间。',
        service: '通过百年灵官方服务中心送检。',
        note: '航空计时系列仿品较多。'
      },
      {
        name: '泰格豪雅',
        en: 'TAG HEUER',
        origin: '瑞士 · 拉绍德封',
        tier: '豪华级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，卡莱拉、摩纳哥系列仿品需专业核验。',
        serial: '序列号刻于后盖，与保卡一致。',
        service: '通过泰格豪雅官方服务中心送检。',
        note: '运动计时款仿冒常见。'
      },
      {
        name: '帝舵',
        en: 'TUDOR',
        origin: '瑞士 · 日内瓦',
        tier: '豪华级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方服务中心检测，Black Bay 系列仿品较多，注意机芯与表冠细节。',
        serial: '序列号刻于后盖或表耳间，与保卡一致。',
        service: '通过帝舵官方服务中心 / 授权专柜送检。',
        note: '与劳力士同集团，保卡制度类似。'
      }
    ]
  },
  {
    id: 'classic',
    name: '经典级 · 大众名表',
    subtitle: '单价适中、受众最广，部分品牌提供官方在线验证，是查询最便捷的区间',
    brands: [
      {
        name: '浪琴',
        en: 'LONGINES',
        origin: '瑞士 · 圣伊米尔',
        tier: '经典级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方授权渠道购买 + 完整填写保修卡（序列号+型号+零售商）。存疑时通过官网"送修我表"申请免费取件，由官方制表师检测。',
        serial: '序列号（连续编号）刻于后盖，与信用卡大小的保修卡序列号一致。',
        service: '官网客服 "Send us your watch" 免费取件送检，或授权专柜。',
        note: '浪琴官方明确：只在授权零售商购得的正品才享受保修与检测。'
      },
      {
        name: '天梭',
        en: 'TISSOT',
        origin: '瑞士 · 力洛克',
        tier: '经典级',
        primary: 'online',
        onlineVerify: '官方支持序列号在线核验：输入序列号可查到型号与保卡信息（官方可查 + 保卡序列号一致 = 强验证）',
        verifyEntry: 'https://www.tissotwatches.cn/',
        verifyEntryNote: '进入天梭中国官网 → 注册腕表/序列号查询；也可用微信小程序"注册我的手表"输入序列号核验。',
        bestPath: '先用官方在线验证系统核验序列号，并可在官网查询该线上商店是否为授权渠道；必要时送官方售后中心检测。',
        serial: '序列号/条形码输入官方查询系统应能返回对应腕表信息。',
        service: '天梭售后官网 / 全国售后服务热线预约检测、维修、真伪鉴定。',
        note: '天梭是中国市场销量最大的瑞士品牌之一，仿品多，官方在线查询是首选。'
      },
      {
        name: '美度',
        en: 'MIDO',
        origin: '瑞士 · 力洛克',
        tier: '经典级',
        primary: 'online',
        onlineVerify: '自2014年起采用 "WS"（Watch-Secur）编号系统，可在官网用该编号查询腕表信息并激活保修',
        verifyEntry: 'https://www.midowatches.cn/',
        verifyEntryNote: '进入美度中国官网 → 用 WS 编号查询 / 激活保修，能查询即证明该编号为正品注册表。',
        bestPath: '用 WS 编号在官网查询并激活保修——能激活即证明该编号为正品注册表。存疑可送官方服务中心全面检测。',
        serial: '2014年后腕表以 WS 编号标识，可官网查询。',
        service: '美度授权服务中心检测，官网可查服务中心地址。',
        note: '美度是少数组提供官方在线核验的主流品牌。'
      },
      {
        name: '雷达',
        en: 'RADO',
        origin: '瑞士 · 朗根塔尔',
        tier: '经典级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '官方授权门店购买 + 保修卡核对，存疑送官方服务中心检测。',
        serial: '序列号刻于后盖，与保卡一致。',
        service: '雷达官方服务中心 / 授权专柜送检。',
        note: '以陶瓷、高科技材质著称，材质手感是判点之一。'
      },
      {
        name: '汉米尔顿',
        en: 'HAMILTON',
        origin: '瑞士 · 比尔（源自美国）',
        tier: '经典级',
        primary: 'service',
        onlineVerify: '无公开在线序列号查询',
        bestPath: '只在官方线上旗舰店或官方授权零售商购买。存疑时提供序列号+型号给官方服务中心核验。',
        serial: '序列号+参考型号（reference）用于唯一识别，送修需同时提交。',
        service: '通过汉米尔顿官网 / 授权零售商联系官方服务。',
        note: '官方FAQ明确只对官方渠道售出的表提供认证。'
      },
      {
        name: '精工',
        en: 'SEIKO',
        origin: '日本 · 东京',
        tier: '经典级',
        primary: 'service',
        onlineVerify: '无统一公开在线序列号查询（Grand Seiko 与入门款方式不同）',
        bestPath: '官方渠道购买，存疑送精工官方售后服务中心检测；Grand Seiko 高端款注意机芯与盘面工艺。',
        serial: '序列号刻于后盖（机芯编号+序列号），可据此推算生产年份。',
        service: '精工中国官方售后服务中心。',
        note: 'Grand Seiko 仿冒少但需专业鉴定；入门款仿品较多。'
      },
      {
        name: '西铁城',
        en: 'CITIZEN',
        origin: '日本 · 东京',
        tier: '经典级',
        primary: 'service',
        onlineVerify: '光动能/电波表可依据型号查询，但无统一在线真伪查询',
        bestPath: '官方渠道购买，光动能功能、型号标识别真伪要点，存疑送官方服务中心。',
        serial: '机芯编号+序列号刻于后盖。',
        service: '西铁城官方售后服务中心。',
        note: '注意与卡西欧等日系品牌的机芯区别。'
      }
    ]
  },
  {
    id: 'smart',
    name: '智能 / 大众表',
    subtitle: '智能表与高性价比大众表，验证相对简单，多数有官方正品码',
    brands: [
      {
        name: '卡西欧 G-SHOCK',
        en: 'CASIO G-SHOCK',
        origin: '日本 · 东京',
        tier: '智能 / 大众表',
        primary: 'online',
        onlineVerify: '官方提供一物一码 / 机身号码（机芯号）防伪验证',
        verifyEntry: 'https://www.casio.com.cn/',
        verifyEntryNote: '进入卡西欧中国官网 / 官方商城 → "一物一码 · 手表真伪鉴定"；背面矩形框内机芯号可用于查询型号与说明书。',
        bestPath: '核对机身背部型号钢印与机芯背刻编号，用官方正品查询通道核验；G-SHOCK 仿冒极多，务必走官方或正规渠道。',
        serial: '背壳钢印型号（如 GA-2100）+ 机芯编号，应与包装与说明书一致。',
        service: '卡西欧官方售后服务中心。',
        note: 'G-SHOCK 为全球仿冒量最大的腕表之一，扫码验证是最佳路径。'
      },
      {
        name: '海鸥',
        en: 'SEAGULL',
        origin: '中国 · 天津',
        tier: '智能 / 大众表',
        primary: 'online',
        onlineVerify: '官方提供防伪标签 / 序列号查询',
        verifyEntry: 'https://www.seagullwatch.com/',
        verifyEntryNote: '进入海鸥表官网 → 查找防伪查询 / 序列号验证入口（国产表通常随附防伪标签，可刮开查询）。',
        bestPath: '核对官方防伪标签与机身编号，用官方防伪查询通道核验。',
        serial: '机身编号 + 防伪标签，可通过官网查验。',
        service: '海鸥表官方售后。',
        note: '国产老牌，注意区分正品与贴牌仿冒。'
      },
      {
        name: '飞亚达',
        en: 'FIYTA',
        origin: '中国 · 深圳',
        tier: '智能 / 大众表',
        primary: 'online',
        onlineVerify: '官方提供防伪码查询：输入表后盖 11 位字母数字串即可核验',
        verifyEntry: 'https://www.fiyta.com.cn/',
        verifyEntryNote: '进入飞亚达官网 → 防伪码查询，输入后盖上的 11 位字母数字串。',
        bestPath: '用官方防伪查询通道核验机身序列号。',
        serial: '机身序列号 + 防伪标签。',
        service: '飞亚达官方售后服务中心。',
        note: '国产主力品牌，正规渠道购买风险低。'
      },
      {
        name: 'Apple Watch',
        en: 'APPLE WATCH',
        origin: '中国 / 美国',
        tier: '智能 / 大众表',
        primary: 'online',
        onlineVerify: '可通过机身序列号在 Apple 官网"检查保障/保修"验证正品',
        verifyEntry: 'https://checkcoverage.apple.com/?locale=zh_CN',
        verifyEntryNote: '进入 Apple 检查保障页面，输入序列号：查到对应机型与保修状态即为正品；仿品序列号通常查不到有效信息。',
        bestPath: '在 iPhone 配对时核验序列号，或用 Apple 官网"检查保障状态"查询——查到对应机型与保修即为正品。',
        serial: '序列号可在表内 设置→通用→关于 查看，与包装序列号一致。',
        service: 'Apple Store / 授权服务商。',
        note: 'Apple 官网序列号查询是唯一权威路径，仿品序列号通常查不到有效保修。'
      }
    ]
  }
];

/* 全局权威第三方鉴定机构（通用验证板块） */
const VERIFY_AGENCIES = [
  {
    name: '中检集团 CCIC 奢侈品鉴定中心',
    desc: '国务院国资委直管央企，当前认可度最高的第三方鉴定机构，可出具具备法律效力的鉴定报告，覆盖腕表等品类。',
    channel: '线上平台在线申请 / 全国网点送检'
  },
  {
    name: '国家钟表质量监督检验中心',
    desc: '国家级钟表质检机构，承担名表品质鉴定、贵金属与机芯检测，出具的鉴定证书可在线查验。',
    channel: '官网预约送检（深圳总部 / 授权受理点）'
  },
  {
    name: '云鱼 / 徐步天（二手表中介鉴定）',
    desc: '二手表交易圈常用中介，提供真伪、成色、原装度、走时全面检测，并支持三方担保交易（卖家寄表→鉴定→买家确认放款）。',
    channel: '线上寄表鉴定 + 三方担保交易'
  }
];
