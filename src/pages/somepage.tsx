// pages/somepage.tsx (or .jsx)
import clientPromise from '../utils/mongodb';

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db('e-learning'); 

  
  const data = await db.collection('users').find({}).toArray();

  return {
    props: { data: JSON.parse(JSON.stringify(data)) },
  };
}

function SomePage({ data }) {
    console.log('data :>> ', data);
  return (
    <div>
     
    </div>
  );
}

export default SomePage;
