import dynamic from 'next/dynamic';
import Script from "next/script";
const DynamicKmapComponent = dynamic(() => import('./components/kmap'), {
  ssr: false
});
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`;



export default function Home() {
  return (
    <>
      <div>
        <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
        <DynamicKmapComponent />
      </div>
    </>
  );
}
