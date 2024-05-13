'use client'




export default function Kmap() {

  

   
  return (

    <>
      <form method="post" action="/api/v1/img/" encType="multipart/form-data">
        <input type="text" name="subject" />
        <input type="file" name="image" />
        <button type="submit">전송</button>
    </form>
      

 
    </>
  );
}


