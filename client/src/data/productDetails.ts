// 제품별 상세 설명 + 전성분 + 핵심 성분 정적 데이터
// 출처: BIFI BLANCHE 브로셔 + bifiblanche.pplx.app

export interface KeyIngredient {
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  description: string;
  descriptionEn: string;
}

export interface ProductDetail {
  shortDesc: string;
  shortDescEn: string;
  longDesc: string;
  longDescEn: string;
  skinConcern: string;
  skinConcernEn: string;
  keyIngredients: KeyIngredient[];
  fullIngredients: string;
}

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  // ── 수분세럼 ──────────────────────────────────────────────────
  "마이크로바이옴 수분세럼": {
    shortDesc: "4중 발효 복합체 · 미백·주름 이중 기능성 세럼",
    shortDescEn: "4-layer fermented complex · Dual-function brightening & anti-wrinkle serum",
    longDesc:
      "프로방스 장미꽃수를 베이스로, 4종 마이크로바이옴 발효 복합체와 갈락토미세스·콤부차·나이아신아마이드·아데노신이 조화를 이룬 고기능 세럼입니다. 속건조·각질·피부 장벽 약화에 집중하며, 식약처 인정 미백·주름 이중 기능성을 동시에 충족합니다.",
    longDescEn:
      "A high-performance serum based on Provence rose water, combining a 4-type microbiome fermented complex with Galactomyces, Kombucha, Niacinamide, and Adenosine. Targets inner dryness, dead skin cells, and a weakened skin barrier, while meeting dual functional certification for brightening and anti-wrinkle from the MFDS.",
    skinConcern: "속건조 · 각질 · 피부 장벽 약화 · 칙칙한 피부톤 · 예민성",
    skinConcernEn: "Inner dryness · Dead skin · Weakened barrier · Dull skin tone · Sensitivity",
    keyIngredients: [
      {
        name: "프로방스장미꽃수",
        nameEn: "Provence Rose Water",
        role: "프리미엄 베이스 · 항산화 · 진정",
        roleEn: "Premium base · Antioxidant · Soothing",
        description:
          "정제수 대신 쓰는 고급 베이스. 장미 폴리페놀이 항산화·진정 효능을 더해줍니다. 원가가 높아 일반 제품에서는 소량 첨가하지만 이 제품은 첫 성분으로 사용합니다.",
        descriptionEn:
          "A luxury base used instead of purified water. Rose polyphenols add antioxidant and soothing properties. While typically used in small amounts due to high cost, this product uses it as the first ingredient.",
      },
      {
        name: "4중 마이크로바이옴 발효 복합체",
        nameEn: "4-Type Microbiome Fermented Complex",
        role: "피부 유익균 환경 조성 · 장벽 회복",
        roleEn: "Beneficial microbiome support · Barrier recovery",
        description:
          "비피다·갈락토미세스(SK-II 계열)·콤부차 등 다양한 발효 성분이 피부 유익균 환경 조성, 장벽 회복, 광채 개선에 시너지를 냅니다.",
        descriptionEn:
          "A synergistic blend of Bifida, Galactomyces (SK-II grade), Kombucha, and other fermented ingredients that promote a healthy skin microbiome, restore the barrier, and enhance radiance.",
      },
      {
        name: "나이아신아마이드",
        nameEn: "Niacinamide",
        role: "식약처 인정 미백 · 모공 · 장벽 강화",
        roleEn: "MFDS-certified brightening · Pore care · Barrier strengthening",
        description:
          "비타민B3 유도체로 멜라닌 전달 억제와 장벽 세라마이드 합성을 돕습니다. 세럼에서 가장 검증된 다기능 기능성 원료 중 하나입니다.",
        descriptionEn:
          "A vitamin B3 derivative that inhibits melanin transfer and supports ceramide synthesis in the skin barrier. One of the most proven multifunctional active ingredients in serums.",
      },
      {
        name: "아데노신",
        nameEn: "Adenosine",
        role: "식약처 인정 주름 개선",
        roleEn: "MFDS-certified anti-wrinkle",
        description:
          "에너지 대사 활성으로 콜라겐 합성을 촉진하는 고시 기능성 원료. 나이아신아마이드와 함께 미백+주름 이중 기능성을 구성합니다.",
        descriptionEn:
          "An officially certified active ingredient that promotes collagen synthesis through energy metabolism activation. Together with Niacinamide, it forms the dual brightening + anti-wrinkle functionality.",
      },
      {
        name: "프룩토올리고사카라이드 + 치커리뿌리추출물",
        nameEn: "Fructooligosaccharides + Chicory Root Extract",
        role: "프리바이오틱스 · 유익균 영양 공급",
        roleEn: "Prebiotic · Beneficial microbiome nourishment",
        description:
          "피부 유익균의 영양분(먹이)이 되는 프리바이오틱스. 발효 성분과 세트로 사용해야 마이크로바이옴 효과가 극대화됩니다.",
        descriptionEn:
          "Prebiotics that serve as nourishment for beneficial skin bacteria. When used together with fermented ingredients, they maximise the microbiome-balancing effect.",
      },
      {
        name: "소듐하이알루로네이트",
        nameEn: "Sodium Hyaluronate",
        role: "수분 보유 · 피부막 형성",
        roleEn: "Moisture retention · Skin film formation",
        description:
          "히알루론산 나트륨염. 피부 친화성이 높고 빠르게 흡수되어 수분막을 형성합니다.",
        descriptionEn:
          "The sodium salt of hyaluronic acid. Highly skin-compatible, it absorbs rapidly to form a moisture-retaining film on the skin.",
      },
    ],
    fullIngredients:
      "프로방스장미꽃수, 정제수, 글리세린, 나이아신아마이드, 1,2-헥산다이올, 효모/자일리눔/홍차발효물, 글리세릴글루코사이드, 글루이베르마이세스추출물, 락토바실러스발효용해물, 효모발효용해여과물, 펜틸렌글라이콜, 카프릴릴글라이콜, 알로에베라잎추출물, 꿀추출물, 모자반추출물, 키위추출물, 갈락토미세스발효여과물, 비피다발효추출물, 락토코쿠스발효물, 스트렙토코쿠스테르모필루스발효물, 락토바실러스발효물, 프룩토올리고사카라이드, 말토덱스트린, 치커리뿌리추출물, 인동덩굴꽃추출물, 초피나무열매추출물, 할미꽃추출물, 자몽추출물, 하이드롤라이즈드스클레로튬검, 폴리소르베이트20, 스쿠알란, 코코넛야자오일, 카보머, 소듐하이알루로네이트, 알지닌, 아데노신",
  },

  // ── 수분크림 ──────────────────────────────────────────────────
  "마이크로바이옴 수분크림": {
    shortDesc: "올리브 유래 천연 유화 · 미백·주름 이중 기능성 크림",
    shortDescEn: "Olive-derived natural emulsion · Dual-function brightening & anti-wrinkle cream",
    longDesc:
      "프로방스 장미꽃수 베이스에 4중 마이크로바이옴 발효와 갈락토미세스·나이아신아마이드·아데노신 기능성이 담긴 수분크림입니다. 합성 유화제 대신 올리브 유래 천연 유화 시스템을 사용하여 세안 후 당기는 피부를 촉촉하게 마무리합니다.",
    longDescEn:
      "A moisturising cream with a Provence rose water base, combining 4-type microbiome fermentation with the active benefits of Galactomyces, Niacinamide, and Adenosine. Uses an olive-derived natural emulsification system instead of synthetic emulsifiers, leaving skin supple and comfortable after cleansing.",
    skinConcern: "수분 부족 · 장벽 강화 · 세안 후 당김 · 칙칙한 피부",
    skinConcernEn: "Moisture deficiency · Barrier strengthening · Post-cleansing tightness · Dull skin",
    keyIngredients: [
      {
        name: "프로방스장미꽃수",
        nameEn: "Provence Rose Water",
        role: "프리미엄 베이스 · 항산화 · 진정",
        roleEn: "Premium base · Antioxidant · Soothing",
        description:
          "수분세럼과 동일한 장미 증류수 베이스. 세럼→크림으로 이어지는 루틴 전체에서 장미 폴리페놀 효능이 누적됩니다.",
        descriptionEn:
          "The same rose distillate base as the Moisture Serum. Rose polyphenol benefits accumulate throughout the serum-to-cream layering routine.",
      },
      {
        name: "4중 마이크로바이옴 발효 복합체",
        nameEn: "4-Type Microbiome Fermented Complex",
        role: "마이크로바이옴 지속 케어",
        roleEn: "Ongoing microbiome care",
        description:
          "비피다·락토코쿠스·스트렙토코쿠스·락토바실러스 발효물로 크림 단계에서도 마이크로바이옴 케어를 지속합니다. 세럼+크림 레이어링이 이 브랜드의 핵심 루틴 설계입니다.",
        descriptionEn:
          "Bifida, Lactococcus, Streptococcus, and Lactobacillus ferments continue microbiome care at the cream stage. Serum + cream layering is the core routine design of this brand.",
      },
      {
        name: "갈락토미세스발효여과물 + 콤부차추출물",
        nameEn: "Galactomyces Ferment Filtrate + Kombucha Extract",
        role: "피부 광채 · pH 최적화",
        roleEn: "Skin radiance · pH optimisation",
        description:
          "SK-II 계열 갈락토미세스가 투명감을 개선하고, 콤부차 유기산이 피부 pH를 약산성으로 유지해 유익균 환경을 지속합니다.",
        descriptionEn:
          "SK-II grade Galactomyces improves skin clarity, while Kombucha organic acids maintain a mildly acidic pH to sustain a healthy microbiome environment.",
      },
      {
        name: "나이아신아마이드 + 아데노신",
        nameEn: "Niacinamide + Adenosine",
        role: "미백 + 주름 개선 이중 기능성",
        roleEn: "Dual-function: brightening + anti-wrinkle",
        description:
          "크림에도 식약처 기능성 원료 두 가지가 모두 담겨 세럼과 크림 루틴 전체에서 지속적인 기능성 케어가 이루어집니다.",
        descriptionEn:
          "Both MFDS-certified active ingredients are included in the cream, ensuring continuous functional care throughout the entire serum and cream routine.",
      },
      {
        name: "세테아릴올리베이트 + 솔비탄올리베이트",
        nameEn: "Cetearyl Olivate + Sorbitan Olivate",
        role: "올리브 유래 천연 유화 시스템",
        roleEn: "Olive-derived natural emulsification system",
        description:
          "합성 유화제 대신 올리브 오일 유래 천연 유화 성분 조합. 피부 자극이 낮고 민감 피부에 적합합니다.",
        descriptionEn:
          "A natural emulsifier combination derived from olive oil, replacing synthetic emulsifiers. Low irritation potential, suitable for sensitive skin.",
      },
      {
        name: "베타인",
        nameEn: "Betaine",
        role: "보습 · 피부 유연화 · 삼투압 조절",
        roleEn: "Moisturising · Skin softening · Osmotic balance",
        description:
          "사탕무 유래 천연 아미노산 유사체. 글리세린과 함께 보습 시너지를 내고 세포 내 수분 보유력을 높입니다.",
        descriptionEn:
          "A natural amino acid analogue derived from sugar beet. Works synergistically with glycerin for enhanced hydration and improves intracellular moisture retention.",
      },
    ],
    fullIngredients:
      "프로방스장미꽃수, 정제수, 글리세린, 세테아릴올리베이트, 솔비탄올리베이트, 부틸렌글라이콜, 폴리글리세릴-2스테아레이트, 글리세릴스테아레이트, 스테아릴알코올, 나이아신아마이드, 스쿠알란, 1,2-헥산다이올, 베타인, 코코넛야자오일, 비피다발효추출물, 락토코쿠스발효물, 스트렙토코쿠스테르모필루스발효물, 락토바실러스발효물, 프룩토올리고사카라이드, 말토덱스트린, 치커리뿌리추출물, 글리세릴글루코사이드, 다이메티콘, 갈락토미세스발효여과물, 콤부차추출물, 클루이베르마이세스추출물, 락토바실러스발효용해물, 효모발효용해여과물, 펜틸렌글라이콜, 카프릴릴글라이콜, 알로에베라잎추출물, 꿀추출물, 모자반추출물, 키위추출물, 인동덩굴꽃추출물, 초피나무열매추출물, 할미꽃추출물, 자몽추출물, 알지닌, 카보머, 소듐하이알루로네이트, 아데노신, 토코페릴아세테이트",
  },

  // ── 클렌징오일 ────────────────────────────────────────────────
  "마이크로바이옴 클렌징오일": {
    shortDesc: "식물성 오일 베이스 · 마이크로바이옴 보호 클렌저",
    shortDescEn: "Plant oil base · Microbiome-protective cleanser",
    longDesc:
      "에스터 오일 베이스에 살구씨·귀리·마이크로바이옴 발효물을 담아 메이크업을 깔끔하게 제거하면서도 클렌징 후 피부 유익균 환경을 보호합니다. 식물성 오일로 메이크업을 젯하게 지워내는 가벼운 워시오프 클렌저입니다.",
    longDescEn:
      "An ester oil base enriched with apricot kernel, oat, and microbiome ferments that thoroughly removes makeup while protecting beneficial skin bacteria after cleansing. A lightweight wash-off cleanser that effortlessly melts away makeup with plant-based oils.",
    skinConcern: "진한 메이크업 · 선크림 잔여물 · 피지 과다 · 클렌징 후 당김",
    skinConcernEn: "Heavy makeup · Sunscreen residue · Excess sebum · Post-cleansing tightness",
    keyIngredients: [
      {
        name: "카프릴릭/카프릭트라이글리세라이드",
        nameEn: "Caprylic/Capric Triglyceride",
        role: "주 클렌징 베이스 오일",
        roleEn: "Primary cleansing base oil",
        description:
          "코코넛 유래 에스터 오일. 피부 자극이 매우 낮고 모공을 막지 않으며 메이크업을 가볍게 녹여냅니다. 미네랄 오일보다 피부 친화적입니다.",
        descriptionEn:
          "A coconut-derived ester oil with very low skin irritation that does not clog pores and gently dissolves makeup. More skin-compatible than mineral oil.",
      },
      {
        name: "살구씨오일",
        nameEn: "Apricot Kernel Oil",
        role: "피부 유연화 · 산뜻한 보습",
        roleEn: "Skin softening · Light moisturising",
        description:
          "올레산과 리놀레산이 풍부해 피부를 부드럽게 만들고 클렌징 후 건조함을 줄입니다. 가볍고 흡수가 빨라 지성 피부도 부담 없습니다.",
        descriptionEn:
          "Rich in oleic and linoleic acids, it softens skin and reduces post-cleansing dryness. Lightweight and fast-absorbing, suitable even for oily skin types.",
      },
      {
        name: "귀리커넬오일",
        nameEn: "Oat Kernel Oil",
        role: "클렌징 후 장벽 보호",
        roleEn: "Post-cleansing barrier protection",
        description:
          "베타글루칸이 클렌징 단계에서도 피부 장벽 성분을 공급해 세안 후 당기는 느낌을 최소화합니다.",
        descriptionEn:
          "Beta-glucan supplies barrier-supporting nutrients even during the cleansing step, minimising the tight feeling after washing.",
      },
      {
        name: "바실러스발효물",
        nameEn: "Bacillus Ferment",
        role: "클렌징 후 마이크로바이옴 보호",
        roleEn: "Post-cleansing microbiome protection",
        description:
          "클렌징으로 일시 교란될 수 있는 피부 마이크로바이옴을 보호합니다. 클렌저에 발효 성분을 담은 브랜드 철학이 반영된 설계입니다.",
        descriptionEn:
          "Protects the skin microbiome that can be temporarily disrupted by cleansing. A design that reflects the brand philosophy of incorporating fermented ingredients even in cleansers.",
      },
      {
        name: "무환자나무열매추출물",
        nameEn: "Soapberry Fruit Extract",
        role: "천연 계면활성제 · 세정 보조",
        roleEn: "Natural surfactant · Cleansing support",
        description:
          "사포닌 풍부한 천연 세정 원료. 합성 계면활성제를 줄이고 천연 세정력을 보완합니다. 자극 지수가 낮아 민감 피부에 유리합니다.",
        descriptionEn:
          "A saponin-rich natural cleansing ingredient that reduces synthetic surfactants while supplementing natural cleansing power. Low irritation index, beneficial for sensitive skin.",
      },
    ],
    fullIngredients:
      "카프릴릭/카프릭트라이글리세라이드, 세틸에틸헥사노에이트, 소르베스-30 테트라올리에이트, 아이소아밀라우레이트, 스쿠알란, 살구씨오일, 호호바씨오일, 귀리커넬오일, 바실러스발효물, 향료, 시트랄, 제라니올, 리날룰, 시트로넬올, 리모넨, 무환자나무열매추출물, 토코페릴아세테이트",
  },

  // ── 페이스오일 ────────────────────────────────────────────────
  "마이크로바이옴 페이스오일": {
    shortDesc: "제주 ROC 인증 녹차씨오일 · 11종 프리미엄 식물성 오일",
    shortDescEn: "Jeju ROC-certified green tea seed oil · 11 premium plant oils",
    longDesc:
      "11종 프리미엄 식물성 오일과 마이크로바이옴 발효물이 담긴 100% 오일 포뮬러입니다. 전세계 다원 중 유일하게 ROC(Regenerative Organic Certified) 인증을 받은 제주 와일드오차드의 녹차씨오일을 사용하며, 가볍고 빠르게 흡수되어 지성·복합성도 부담 없이 사용 가능합니다.",
    longDescEn:
      "A 100% oil formula featuring 11 premium plant oils and microbiome ferments. Uses green tea seed oil from Jeju Wild Orchard — the world's only tea garden to hold ROC (Regenerative Organic Certified) status. Lightweight and fast-absorbing, suitable for oily and combination skin types.",
    skinConcern: "피부 윤기 부족 · 탄력 저하 · 건조 · 노화 케어",
    skinConcernEn: "Lack of radiance · Loss of firmness · Dryness · Anti-ageing care",
    keyIngredients: [
      {
        name: "녹차씨오일 (제주 ROC 유기농)",
        nameEn: "Green Tea Seed Oil (Jeju ROC Organic)",
        role: "항산화 · 산화 안정성",
        roleEn: "Antioxidant · Oxidative stability",
        description:
          "전세계 다원 중 유일하게 ROC 인증을 받은 제주 와일드오차드의 녹차씨오일만 사용합니다. 카테킨이 풍부해 강력한 항산화 효능을 내며 올리브보다 산화 안정성이 높습니다.",
        descriptionEn:
          "Only green tea seed oil from Jeju Wild Orchard, the world's sole ROC-certified tea garden, is used. Rich in catechins for powerful antioxidant activity with higher oxidative stability than olive oil.",
      },
      {
        name: "스쿠알란",
        nameEn: "Squalane",
        role: "피부 유사 지질 · 기저 보습",
        roleEn: "Skin-identical lipid · Deep moisturising",
        description:
          "올리브 유래로 인체 피지와 구조가 유사. 모공을 막지 않고 빠르게 흡수되어 지성 피부도 부담 없는 최고급 오일 원료입니다.",
        descriptionEn:
          "Derived from olives, its structure closely resembles human sebum. A premium oil ingredient that absorbs quickly without clogging pores — suitable even for oily skin.",
      },
      {
        name: "호호바씨오일",
        nameEn: "Jojoba Seed Oil",
        role: "피부 친화 · 피지 조절",
        roleEn: "Skin compatibility · Sebum regulation",
        description:
          "피부 피지(세붐)와 분자 구조가 가장 비슷해 모든 피부 타입에 잘 맞는 만능 오일입니다. 피부 표면에 얇은 보호막을 만들면서도 모공을 막지 않고 피지 분비를 자연스럽게 조절합니다.",
        descriptionEn:
          "Most closely resembles the molecular structure of human sebum, making it a versatile oil suitable for all skin types. Forms a thin protective film on the skin while naturally regulating sebum without clogging pores.",
      },
      {
        name: "아르간커넬오일",
        nameEn: "Argan Kernel Oil",
        role: "피부 탄력 · 영양 · 항산화",
        roleEn: "Skin firmness · Nourishment · Antioxidant",
        description:
          "모로코산 '액체 황금'. 비타민E와 필수지방산이 풍부해 탄력·노화 방지에 탁월한 고가 원료입니다.",
        descriptionEn:
          "Morocco's 'liquid gold'. Rich in vitamin E and essential fatty acids, it is a premium ingredient known for its exceptional anti-ageing and firming properties.",
      },
      {
        name: "락토바실러스발효물 + 바실러스발효물",
        nameEn: "Lactobacillus Ferment + Bacillus Ferment",
        role: "SynBi Complex™ · 오일 마이크로바이옴",
        roleEn: "SynBi Complex™ · Oil-phase microbiome",
        description:
          "SynBi Complex™ 기반 지용성 발효 성분을 오일 제형에 담은 드문 시도. 피부 장벽 유익균 환경을 강화합니다.",
        descriptionEn:
          "A rare approach incorporating oil-soluble fermented ingredients based on SynBi Complex™ into an oil formula. Strengthens the beneficial microbiome environment of the skin barrier.",
      },
      {
        name: "토코페롤 (비타민E)",
        nameEn: "Tocopherol (Vitamin E)",
        role: "항산화 · 오일 산패 방지",
        roleEn: "Antioxidant · Oil rancidity prevention",
        description:
          "지용성 항산화제로 오일들의 산화를 막고 피부 산화 스트레스로부터 보호합니다. 오일 제품에 필수적입니다.",
        descriptionEn:
          "A fat-soluble antioxidant that prevents oil oxidation and protects the skin from oxidative stress. Essential in oil-based formulations.",
      },
    ],
    fullIngredients:
      "호호바씨오일, 카프릴릭/카프릭트라이글리세라이드, 유럽개암씨오일, 스쿠알란, 아르간커넬오일, 포도씨오일, 올리브오일, 녹차씨오일, 동백나무씨오일, 아마씨오일, 락토바실러스발효물, 바실러스발효물, 귀리커넬오일, 토코페롤, 일랑일랑꽃오일, 광곽향오일, 레몬껍질오일, 오렌지껍질오일, 리씨열매오일, 고수열매오일, 라반딘오일, 센티드제라늄꽃오일, 소두구씨오일, 쿠민씨오일, 트라이에틸시트레이트, 벤질벤조에이트, 리모넨, 리날룰",
  },

  // ── 아이앤립컨투어크림 ────────────────────────────────────────
  "마이크로바이옴 아이앤립컨투어크림": {
    shortDesc: "2종 펩타이드 + 세라마이드 · 눈가·입가 안티에이징",
    shortDescEn: "2 peptides + ceramide · Eye & lip contour anti-ageing",
    longDesc:
      "트라이펩타이드-29와 아세틸헥사펩타이드-8(아르기렐린) 두 가지 펩타이드에 세라마이드·4중 발효·트레할로오스 보습 복합체가 담긴 고기능 아이크림입니다. 눈가·입가의 잔주름과 탄력 저하에 집중 케어합니다.",
    longDescEn:
      "A high-performance eye cream featuring two peptides — Tripeptide-29 and Acetyl Hexapeptide-8 (Argireline) — combined with ceramide, a 4-type fermented complex, and a trehalose moisturising blend. Provides intensive care for fine lines and loss of firmness around the eyes and lips.",
    skinConcern: "눈가 주름 · 탄력 저하 · 눈가 건조 · 입가 잔주름",
    skinConcernEn: "Eye area wrinkles · Loss of firmness · Eye area dryness · Fine lines around the lips",
    keyIngredients: [
      {
        name: "트라이펩타이드-29",
        nameEn: "Tripeptide-29",
        role: "콜라겐 합성 자극 · 탄력 개선",
        roleEn: "Collagen synthesis stimulation · Firmness improvement",
        description:
          "피부 콜라겐 섬유 합성을 직접 자극하는 프로콜라겐 펩타이드. 눈가처럼 콜라겐이 빠르게 줄어드는 부위에 효과적인 고급 안티에이징 성분입니다.",
        descriptionEn:
          "A procollagen peptide that directly stimulates the synthesis of collagen fibres in the skin. A premium anti-ageing ingredient particularly effective in areas like the eye contour where collagen diminishes rapidly.",
      },
      {
        name: "아세틸헥사펩타이드-8 (아르기렐린)",
        nameEn: "Acetyl Hexapeptide-8 (Argireline)",
        role: "표정 주름 완화 · 탄력",
        roleEn: "Expression line reduction · Firmness",
        description:
          "근육 수축 신호를 부분적으로 차단해 반복 표정으로 생긴 눈가 잔주름에 효과적입니다. 아이크림에서 가장 고가의 펩타이드 성분 중 하나입니다.",
        descriptionEn:
          "Partially blocks muscle contraction signals, making it effective for fine lines caused by repeated facial expressions. One of the most premium peptide ingredients used in eye creams.",
      },
      {
        name: "세라마이드엔피",
        nameEn: "Ceramide NP",
        role: "피부 장벽 구성 지질",
        roleEn: "Skin barrier lipid",
        description:
          "각질층 세포간 지질의 핵심 성분. 눈가 얇은 피부 수분 손실을 막고 장벽을 복원합니다.",
        descriptionEn:
          "A key component of the intercellular lipids in the stratum corneum. Prevents moisture loss in the thin skin around the eyes and restores the barrier.",
      },
      {
        name: "글라이코실트레할로오스 + 하이드로제네이티드스타치하이드롤리세이트",
        nameEn: "Glycosyl Trehalose + Hydrogenated Starch Hydrolysate",
        role: "고효능 보습 복합체 (트레할로오스 계열)",
        roleEn: "High-performance moisturising complex (trehalose-based)",
        description:
          "식물이 건조 환경에서 수분을 유지하는 원리를 피부에 적용한 고급 보습 소재. 히알루론산보다 강력한 수분 보유력을 가집니다.",
        descriptionEn:
          "A premium moisturising material that applies the mechanism plants use to retain water in dry conditions to the skin. Offers stronger moisture-holding capacity than hyaluronic acid.",
      },
      {
        name: "4중 마이크로바이옴 발효 복합체",
        nameEn: "4-Type Microbiome Fermented Complex",
        role: "마이크로바이옴 케어",
        roleEn: "Microbiome care",
        description:
          "비피다·락토코쿠스·스트렙토코쿠스·락토바실러스 4가지 발효 성분을 동시에 사용해 눈가 피부 재생과 장벽 강화에 시너지를 냅니다.",
        descriptionEn:
          "Four fermented ingredients — Bifida, Lactococcus, Streptococcus, and Lactobacillus — work synergistically to support skin regeneration and barrier strengthening around the delicate eye area.",
      },
      {
        name: "아데노신",
        nameEn: "Adenosine",
        role: "식약처 인정 주름 개선 기능성",
        roleEn: "MFDS-certified anti-wrinkle active",
        description:
          "식약처 고시 주름 개선 기능성 원료. 펩타이드와 함께 콜라겐 합성 경로를 다각도로 자극해 시너지 효과를 기대할 수 있습니다.",
        descriptionEn:
          "An officially certified anti-wrinkle ingredient from the MFDS. Combined with peptides, it stimulates collagen synthesis pathways from multiple angles for a synergistic effect.",
      },
    ],
    fullIngredients:
      "정제수, 스쿠알란, 글리세린, 세테아릴올리베이트, 솔비탄올리베이트, 카프릴릭/카프릭트라이글리세라이드, 1,2-헥산다이올, 하이드로제네이티드레시틴, C12-16알코올, 팔미틱애씨드, 나이아신아마이드, 글라이코실트레할로오스, 하이드로제네이티드스타치하이드롤리세이트, 말토올리고실글루코사이드, 말토덱스트린, 치커리뿌리추출물, 비피다발효추출물, 락토코쿠스발효물, 락토바실러스발효물, 스트렙토코쿠스테르모필루스발효물, 프룩토올리고사카라이드, 세테아릴알코올, 세틸팔미테이트, 솔비탄팔미테이트, 솔비탄올리에이트, 호호바씨오일, 코코넛야자오일, 부틸렌글라이콜, 카프릴릴글라이콜, 트라이펩타이드-29, 아세틸헥사펩타이드-8, 클루이베르마이세스추출물, 락토바실러스발효용해물, 효모발효용해여과물, 펜틸렌글라이콜, 글리세릴글루코사이드, 세라마이드엔피, 다이프로필렌글라이콜, 글리세레스-20, 글리세릴스테아레이트, 피이지-10레이프씨드스테롤, 알란토인, 아데노신, 토코페릴아세테이트, 알지닌, 카보머, 소듐하이알루로네이트, 하이드롤라이즈드하이알루로닉애씨드",
  },

  // ── 핸드크림 ──────────────────────────────────────────────────
  "마이크로바이옴 핸드크림": {
    shortDesc: "시어버터 · 10종 천연 에센셜 오일 · 바닐라 향",
    shortDescEn: "Shea butter · 10 natural essential oils · Vanilla scent",
    longDesc:
      "시어버터와 10종 이상의 천연 에센셜 오일 블렌딩으로 고보습과 향기를 동시에 즐깁니다. 흡수력이 뛰어나 끈적임 없이 발리며, 부드러운 바닐라 향으로 일상에 작은 기분 전환을 선사합니다.",
    longDescEn:
      "Enjoy intensive hydration and fragrance together with shea butter and a blend of over 10 natural essential oils. Absorbs beautifully without stickiness, and a gentle vanilla scent adds a small moment of pleasure to everyday life.",
    skinConcern: "손 건조 · 거칠음 · 큐티클 손상 · 겨울 손 트임",
    skinConcernEn: "Dry hands · Roughness · Damaged cuticles · Winter chapping",
    keyIngredients: [
      {
        name: "시어버터",
        nameEn: "Shea Butter",
        role: "주 고보습 · 피부 영양",
        roleEn: "Primary deep moisturising · Skin nourishment",
        description:
          "핸드크림의 핵심 보습 성분. 피마자오일·카나우바왁스와 함께 오래 지속되는 보습막을 형성합니다.",
        descriptionEn:
          "The core moisturising ingredient in this hand cream. Together with castor oil and carnauba wax, it forms a long-lasting moisture barrier.",
      },
      {
        name: "10종 에센셜 오일 블렌딩",
        nameEn: "10-Essential Oil Blend",
        role: "천연 퍼퓨밍 · 항균 · 피부 안정화",
        roleEn: "Natural perfuming · Antimicrobial · Skin calming",
        description:
          "일랑일랑·광곽향·라반딘 등 각각 항균·항염·진정 기능도 있는 고급 원료들의 조향 블렌딩. 단순 향이 아닌 기능성 오일 조합입니다.",
        descriptionEn:
          "A fragrance blend of premium ingredients including ylang ylang, patchouli, and lavandin — each with antimicrobial, anti-inflammatory, or soothing functions. More than just a scent; a combination of functional oils.",
      },
      {
        name: "병풀추출물 + 황금추출물 + 호장근뿌리추출물",
        nameEn: "Centella Asiatica + Scutellaria Baicalensis + Polygonum Cuspidatum Root Extract",
        role: "진정 · 항염 · 재생",
        roleEn: "Soothing · Anti-inflammatory · Regenerating",
        description:
          "손 피부 트임·거칠음을 진정시키는 식물 추출물 트리오. 병풀(콜라겐 재생), 황금(항염), 호장근(항산화) 역할 분담이 명확합니다.",
        descriptionEn:
          "A trio of plant extracts that soothe cracked and rough hand skin. Each has a clear role: Centella Asiatica (collagen regeneration), Scutellaria (anti-inflammatory), Polygonum (antioxidant).",
      },
      {
        name: "세테아릴올리베이트 + 솔비탄올리베이트",
        nameEn: "Cetearyl Olivate + Sorbitan Olivate",
        role: "올리브 유래 천연 유화 시스템",
        roleEn: "Olive-derived natural emulsification system",
        description:
          "합성 유화제 대신 올리브 오일 유래 천연 유화 성분 조합. 피부 자극이 낮고 민감 피부에 적합합니다.",
        descriptionEn:
          "A natural emulsifier combination derived from olive oil, replacing synthetic emulsifiers. Low irritation potential, suitable for sensitive skin.",
      },
      {
        name: "소듐하이알루로네이트",
        nameEn: "Sodium Hyaluronate",
        role: "수분 보유 · 피부막 형성",
        roleEn: "Moisture retention · Skin film formation",
        description:
          "히알루론산 나트륨염. 손 피부에 빠르게 흡수되어 수분막을 형성하고 끈적임 없는 보습감을 제공합니다.",
        descriptionEn:
          "The sodium salt of hyaluronic acid. Absorbs quickly into the skin on hands, forming a moisture-retaining film with a non-sticky feel.",
      },
    ],
    fullIngredients:
      "정제수, 시어버터, 카프릴릭/카프릭트라이글리세라이드, 글리세린, 세테아릴올리베이트, 솔비탄올리베이트, 1,2-헥산다이올, 세테아릴알코올, 피마자씨오일, 하이드로제네이티드캐스터오일, 카나우바왁스, 스쿠알란, 글리세릴스테아레이트, 호호바씨오일, 코코넛야자오일, 부틸렌글라이콜, 병풀추출물, 호장근뿌리추출물, 황금추출물, 녹차추출물, 스페인감초뿌리추출물, 마트리카리아꽃추출물, 로즈마리잎추출물, 알로에베라잎추출물, 클루이베르마이세스추출물, 락토바실러스발효용해물, 효모발효용해여과물, 펜틸렌글라이콜, 카프릴릴글라이콜, 글리세릴글루코사이드, 알지닌, 아크릴레이트/C10-30알킬아크릴레이트크로스폴리머, 일랑일랑꽃오일, 광곽향오일, 레몬껍질오일, 오렌지껍질오일, 리씨열매오일, 고수열매오일, 라반딘오일, 센티드제라늄꽃오일, 소두구씨오일, 쿠민씨오일, 트라이에틸시트레이트, 벤질벤조에이트, 리모넨, 리날룰, 토코페릴아세테이트, 감나무잎추출물, 육계나무껍질추출물, 쑥잎추출물, 크리산텔룸인디쿰추출물, 모과추출물, 소듐하이알루로네이트",
  },

  // ── 풋크림 ────────────────────────────────────────────────────
  "마이크로바이옴 풋크림": {
    shortDesc: "로즈마리 캠퍼 쿨링 · 시어버터 마사지 풋크림",
    shortDescEn: "Rosemary camphor cooling · Shea butter massage foot cream",
    longDesc:
      "로즈마리 캠퍼의 시원한 청량감이 종아리·허리 등 뭉친 근육과 뻐근한 부위 마사지에 탁월합니다. 시어버터 베이스에 6종 식물 추출물이 더해져 부드러운 마사지감을 만들며, 로즈마리 아로마 향이 몸과 마음을 편안하게 합니다.",
    longDescEn:
      "The refreshing cooling sensation of rosemary camphor is excellent for massaging tense muscles in the calves, lower back, and other areas. A shea butter base enriched with six plant extracts provides a smooth massage texture, while the rosemary aroma soothes both body and mind.",
    skinConcern: "뻐근한 종아리 · 허리·어깨 뭉침 · 피로한 다리 · 시원한 마사지",
    skinConcernEn: "Tense calves · Stiff back & shoulders · Tired legs · Cooling massage",
    keyIngredients: [
      {
        name: "로즈마리잎추출물 + 로즈마리잎오일",
        nameEn: "Rosemary Leaf Extract + Rosemary Leaf Oil",
        role: "근육 이완 · 시원한 마사지",
        roleEn: "Muscle relaxation · Cooling massage",
        description:
          "로즈마리 특유의 시원한 청량감이 뻐근하거나 뭉친 부위를 풀어주는 마사지에 탁월합니다. 추출물(수용성)과 오일(지용성) 동시 사용으로 효능을 극대화했습니다.",
        descriptionEn:
          "The characteristic cooling freshness of rosemary is excellent for massaging tense or stiff areas. Simultaneous use of the extract (water-soluble) and oil (oil-soluble) maximises efficacy.",
      },
      {
        name: "캠퍼 (로즈마리 천연 성분)",
        nameEn: "Camphor (natural component of rosemary)",
        role: "근육 이완 · 쿨링 감각",
        roleEn: "Muscle relaxation · Cooling sensation",
        description:
          "로즈마리 오일에 자연적으로 함유된 캠퍼 성분. 아로마테라피에서 근육 경련·관절 통증 완화에 전통적으로 사용되며, 피부에 따뜻하면서도 시원한 감각을 줍니다.",
        descriptionEn:
          "Camphor naturally present in rosemary oil. Traditionally used in aromatherapy to relieve muscle cramps and joint pain, it gives skin both a warm and cool sensation simultaneously.",
      },
      {
        name: "시어버터",
        nameEn: "Shea Butter",
        role: "고보습 · 마사지 발림성",
        roleEn: "Deep moisturising · Smooth massage texture",
        description:
          "아프리카산 시어나무 열매 오일. 지방산과 비타민A·E가 풍부해 마사지할 때 부드러운 발림성을 만들고 피부에 영양을 공급합니다.",
        descriptionEn:
          "Oil from the African shea tree fruit. Rich in fatty acids and vitamins A and E, it provides a smooth, gliding massage texture while deeply nourishing the skin.",
      },
      {
        name: "병풀추출물",
        nameEn: "Centella Asiatica Extract",
        role: "진정 · 재생",
        roleEn: "Soothing · Regenerating",
        description:
          "아시아티코사이드가 콜라겐 합성을 촉진하고 마사지로 자극받은 피부를 진정·재생시킵니다.",
        descriptionEn:
          "Asiaticoside promotes collagen synthesis and soothes and regenerates skin stimulated by massage.",
      },
      {
        name: "황금추출물 + 호장근뿌리추출물",
        nameEn: "Scutellaria Baicalensis Extract + Polygonum Cuspidatum Root Extract",
        role: "항염 · 항산화 · 한방 진정",
        roleEn: "Anti-inflammatory · Antioxidant · Herbal soothing",
        description:
          "황금(바이칼린)은 항염, 호장근(레스베라트롤 계열)은 강력한 항산화 효능을 가진 고급 한방 원료 조합입니다.",
        descriptionEn:
          "Scutellaria (baicalin) provides anti-inflammatory benefits, while Polygonum (resveratrol-related compounds) delivers powerful antioxidant activity — a premium herbal ingredient combination.",
      },
      {
        name: "파파인",
        nameEn: "Papain",
        role: "각질 케어 보조",
        roleEn: "Exfoliation support",
        description:
          "파파야 유래 단백질 분해 효소. 마사지와 함께 두꺼운 각질을 부드럽게 정돈해 매끈한 마사지감을 돕습니다.",
        descriptionEn:
          "A proteolytic enzyme derived from papaya. Combined with massage, it gently refines thickened dead skin cells for a smooth massage experience.",
      },
    ],
    fullIngredients:
      "정제수, 시어버터, 글리세린, 카프릴릭/카프릭트라이글리세라이드, 글리세릴스테아레이트, 세테아릴올리베이트, 솔비탄올리베이트, 1,2헥산다이올, 세테아릴알코올, 호호바씨오일, 피마자씨오일, 하이드로제네이티드캐스터오일, 카나우바왁스, 스쿠알란, 파파인, 글루코오스, 녹차씨오일, 부틸렌글라이콜, 병풀추출물, 호장근뿌리추출물, 황금추출물, 녹차추출물, 스페인감초뿌리추출물, 마트리카리아꽃추출물, 로즈마리잎추출물, 알로에잎추출물, 클루이베르마이세스추출물, 락토바실러스발효용해물, 효모발효용해여과물, 펜틸렌글라이콜, 카프릴릴글라이콜, 글리세릴글루코사이드, 로즈마리잎오일, 리모넨, 리날룰, 알지닌, 아크릴레이트/C10-30알킬아크릴레이트크로스폴리머, 토코페릴아세테이트, 감나무잎추출물, 육계나무껍질추출물, 쑥잎추출물, 크리산텔룸인디쿰추출물, 모과추출물, 소듐하이알루로네이트",
  },
};
