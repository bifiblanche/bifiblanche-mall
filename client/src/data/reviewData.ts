import reviewCream1 from "@assets/review-cream-1.jpg";
import reviewCream2 from "@assets/review-cream-2.jpg";
import reviewFaceoil1 from "@assets/review-faceoil-1.jpg";
import reviewHandcream1 from "@assets/review-handcream-1.jpg";

export interface Review {
  id: number;
  nickname: string;
  date: string;
  rating: number;
  text: string;
  image?: string;
  skinType?: string;
}

export const REVIEWS: Record<string, Review[]> = {
  "마이크로바이옴 수분크림": [
    {
      id: 1,
      nickname: "sunm*****",
      date: "2026.05.21",
      rating: 5,
      text: "신혼여행 14박가서 비피 샘플 싹 다 가져가서 썼어요! 너무너무 향기도 좋고 촉촉해요 ㅠㅠ",
      image: reviewCream1,
      skinType: "중성 · 민감성 · 모공 · 속건조",
    },
    {
      id: 2,
      nickname: "audw******",
      date: "2026.04.15",
      rating: 5,
      text: "벌써 5통째 구매중 .. 㐅 처음 용산아이파크몰에서 영업하신 직원에게 홀려 하나 구입했는데 너무 좋아서 계속 구입중이에요 제가 쿠션유목민이었는데 이걸 바르고나서는 아무 쿠션을 발라도 다~ 피부가 너무 좋아보이더라구요 쿠션이 문제가 아니었어요 역시 기초, 보습이 최고! 앞으로 계속 사야하니까 할인 자주해주시고 팝업스토어도 많이 열어주세요 !! 🙏 그리고 아이파크몰에서 열심히 설명해주신 직분분 ㅠㅠ 저를 영업해주셔서 감사합니다ㅎㅎ",
      image: reviewCream2,
      skinType: "복합성 · 속건조",
    },
  ],
  "마이크로바이옴 페이스오일": [
    {
      id: 3,
      nickname: "dong********",
      date: "2026.03.27",
      rating: 5,
      text: "용산 팝업 이벤트로 본품 당첨되고 샘플로 주신 오일도 발라봤는데 정말 충격이었슴,,, 넘 조와요,,, 그리고 그날 계셨던 빨간모자 쓴 남자직원분이 너무 친절하고 즐겁게 응대해주셔서 저에겐 너무 재밌고 신나는(?) 비피..!로 남아있어요ㅋㅋ 앞으로도 더더 잘되시길 바랍니다! 영업할게여 ㅎㅎ 화팅!!!!",
      image: reviewFaceoil1,
      skinType: "복합성 · 주름 · 트러블 · 블랙헤드",
    },
  ],
  "마이크로바이옴 핸드크림": [
    {
      id: 4,
      nickname: "vo****",
      date: "2026.02.28",
      rating: 5,
      text: "지인이 쓰는 거 빌려 발라봤더니 향도 고급스럽고 롹×땅도 안들던 피부 건조함이 바로 해결되어서 구매했어요. 구매한 김에 가격이 착해서 지인들 선물주려고 왕창 샀어요. 만족합니다",
      image: reviewHandcream1,
      skinType: "",
    },
  ],
};
