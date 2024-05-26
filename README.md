
# 공유해유

## 프로젝트 소개
맛집, 명소등 기억에 남는 장소를 저장하고 장소에 대해 글을 작성하여  
다른 사람들에게 공유할 수 있는 위치 기반 공유 서비스입니다






## ⚙ 기술 스택


<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
<img src="https://img.shields.io/badge/MongoDb-47A248?style=for-the-badge&logo=MongoDb&logoColor=white">
<img src="https://img.shields.io/badge/tailwind_css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
<img src="https://img.shields.io/badge/Daisy_ui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white">  

## 💡 주요 기능


## 📃 API 명세서



## ▶️ 프로젝트 실행

> .env 파일 추가

[🔗카카오톡로그인 API키 발급](https://developers.kakao.com/docs/latest/ko/kakaologin/common)  
```yaml
#.env
NEXT_PUBLIC_KAKAO_APP_JS_KEY = 카카오맵 JS 키
MONGODB = mongoDB 접속 주소

KAKAO_CLIENT_ID = 카카오 로그인 클라이언트 키
KAKAO_CLIENT_SECRET = 카카오 로그인 시크릿 키

BACKEND_URL = http://localhost:3000

NEXTAUTH_URL = http://localhost:3000
NEXTAUTH_URL_INTERNAL = http://127.0.0.1:3000

NEXTAUTH_SECRET = openssl rand -base64 32 키생성
```