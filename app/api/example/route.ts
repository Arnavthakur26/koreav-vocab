import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get("word")

  if (!word) {
    return NextResponse.json({ error: "Word parameter is required" }, { status: 400 })
  }

  // Simulated example sentences for Korean words
  const examples: Record<string, string> = {
    안녕하세요: "안녕하세요, 만나서 반갑습니다. (Hello, nice to meet you.)",
    감사합니다: "도와주셔서 감사합니다. (Thank you for helping me.)",
    사랑: "나는 너를 사랑해. (I love you.)",
    친구: "그는 나의 좋은 친구입니다. (He is my good friend.)",
    가족: "가족과 함께 시간을 보냅니다. (I spend time with my family.)",
    음식: "한국 음식은 맛있습니다. (Korean food is delicious.)",
    물: "물 한 잔 주세요. (Please give me a glass of water.)",
    책: "나는 책 읽기를 좋아합니다. (I like reading books.)",
    학교: "학교에 갑니다. (I go to school.)",
    선생님: "선생님께서 수업을 하십니다. (The teacher is conducting a class.)",
    학생: "학생들이 공부하고 있습니다. (The students are studying.)",
    집: "집에 가고 싶어요. (I want to go home.)",
    차: "새 차를 샀습니다. (I bought a new car.)",
    시간: "시간이 없어요. (I don't have time.)",
    날씨: "오늘 날씨가 좋습니다. (The weather is nice today.)",
    꽃: "정원에 꽃이 많습니다. (There are many flowers in the garden.)",
    나무: "큰 나무 아래에서 쉬었습니다. (I rested under a big tree.)",
    바다: "바다에서 수영했습니다. (I swam in the sea.)",
    산: "주말에 산에 갑니다. (I go to the mountains on weekends.)",
    강: "강 근처에 살고 있습니다. (I live near the river.)",
    도시: "서울은 큰 도시입니다. (Seoul is a big city.)",
    나라: "한국은 아름다운 나라입니다. (Korea is a beautiful country.)",
    언어: "새로운 언어를 배우고 있습니다. (I am learning a new language.)",
    문화: "한국 문화에 관심이 있습니다. (I am interested in Korean culture.)",
    음악: "음악을 듣는 것을 좋아합니다. (I like listening to music.)",
    영화: "주말에 영화를 봅니다. (I watch movies on weekends.)",
    운동: "매일 운동합니다. (I exercise every day.)",
    여행: "여행을 좋아합니다. (I like traveling.)",
    컴퓨터: "컴퓨터로 일합니다. (I work on a computer.)",
    전화: "전화 주세요. (Please call me.)",
  }

  const example = examples[word] || `Example sentence with ${word} will be displayed here.`

  return NextResponse.json({ example })
}
