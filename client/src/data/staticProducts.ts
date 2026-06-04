// 제품 목록 정적 데이터 — API 호출 없이 직접 사용
// 서버 DB seed와 동일한 데이터 + storeUrl + productDetails 연동용 키

export interface StaticProduct {
  id: number;
  name: string;       // EN
  nameKo: string;     // KR
  category: string;
  price: number;
  description: string;     // EN
  descriptionKo: string;   // KR
  keyIngredient: string;
  image: string;
  volume: string;
  storeUrl: string;
}

export const STATIC_PRODUCTS: StaticProduct[] = [
  {
    id: 1,
    name: "Microbiome Serum",
    nameKo: "마이크로바이옴 수분세럼",
    category: "serum",
    price: 45000,
    description: "A lightweight serum that hydrates deeply while protecting your skin's microbiome ecosystem.",
    descriptionKo: "피부 마이크로바이옴 생태계를 보호하며 깊은 수분을 공급하는 가벼운 세럼입니다.",
    keyIngredient: "프리바이오틱 + 발효 성분",
    image: "/assets/serum-box.jpg",
    volume: "40ml",
    storeUrl: "https://smartstore.naver.com/seasonglass/products/12155116667",
  },
  {
    id: 2,
    name: "Microbiome Cream",
    nameKo: "마이크로바이옴 수분크림",
    category: "cream",
    price: 52000,
    description: "A nourishing cream that maintains skin balance and reinforces the natural moisture barrier.",
    descriptionKo: "피부 균형을 유지하고 자연 수분 장벽을 강화하는 영양 크림입니다.",
    keyIngredient: "프리바이오틱 + 발효 세라마이드",
    image: "/assets/cream-open.jpg",
    volume: "60g",
    storeUrl: "https://smartstore.naver.com/seasonglass/products/12154586932",
  },
  {
    id: 3,
    name: "Hand Cream",
    nameKo: "마이크로바이옴 핸드크림",
    category: "body",
    price: 22000,
    description: "A lightweight hand cream that deeply moisturizes while maintaining the skin microbiome.",
    descriptionKo: "피부 마이크로바이옴을 유지하면서 깊은 보습을 제공하는 가벼운 핸드크림입니다.",
    keyIngredient: "프리바이오틱 + 식물성 버터",
    image: "/assets/handcream.jpg",
    volume: "30g",
    storeUrl: "https://smartstore.naver.com/seasonglass/products/12569339458",
  },
  {
    id: 4,
    name: "Cleansing Oil",
    nameKo: "마이크로바이옴 클렌징오일",
    category: "cleansing",
    price: 38000,
    description: "A pure plant-based cleansing oil that gently removes makeup while protecting the skin microbiome.",
    descriptionKo: "피부 마이크로바이옴을 보호하며 메이크업을 깔끔하게 제거하는 식물성 클렌징오일입니다.",
    keyIngredient: "식물성 오일 블렌드",
    image: "/assets/cleansingoil-product.jpg",
    volume: "130ml",
    storeUrl: "https://smartstore.naver.com/seasonglass/products/12154869450",
  },
  {
    id: 5,
    name: "Face Oil",
    nameKo: "마이크로바이옴 페이스오일",
    category: "oil",
    price: 55000,
    description: "A nourishing face oil with Jeju ROC-certified green tea seed oil that restores skin radiance.",
    descriptionKo: "제주 ROC 인증 녹차씨오일과 11종 프리미엄 식물성 오일이 담긴 페이스오일입니다.",
    keyIngredient: "녹차씨오일 + 식물성 스쿠알란",
    image: "/assets/faceoil-product.jpg",
    volume: "40ml",
    storeUrl: "https://smartstore.naver.com/seasonglass/products/12477826981",
  },
  {
    id: 6,
    name: "Eye & Lip Contour Cream",
    nameKo: "마이크로바이옴 아이앤립컨투어크림",
    category: "eye",
    price: 48000,
    description: "A delicate contour cream formulated with peptides for the sensitive eye and lip area.",
    descriptionKo: "콜라겐 펩타이드로 눈가·입가를 탄탄하게 케어하는 컨투어 크림입니다.",
    keyIngredient: "트라이펩타이드-29 + 아르기렐린",
    image: "/assets/eyelip-product.jpg",
    volume: "20g",
    storeUrl: "https://smartstore.naver.com/seasonglass/products/12544056248",
  },
  {
    id: 7,
    name: "Foot Cream",
    nameKo: "마이크로바이옴 풋크림",
    category: "body",
    price: 22000,
    description: "An intensive foot cream with rosemary essential oil for deep moisture and aromatherapy.",
    descriptionKo: "로즈마리 에센셜오일로 깊은 보습과 아로마테라피를 동시에 즐기는 풋크림입니다.",
    keyIngredient: "로즈마리 에센셜오일 + 시어버터",
    image: "/assets/footcream-product.jpg",
    volume: "70g",
    storeUrl: "https://smartstore.naver.com/seasonglass/products/12569372697",
  },
];
