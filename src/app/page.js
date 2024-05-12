import dynamic from 'next/dynamic';
const DynamicKmapComponent = dynamic(() => import('./components/kmap'), {
  ssr: false
});



export default function Home() {
  return (
    <>
      <div>
        <DynamicKmapComponent />
      </div>
    </>
  );
}
