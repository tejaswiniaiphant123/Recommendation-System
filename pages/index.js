import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const { userId } = router.query;
  
  const [post, setPost] = useState([]);
  let Recs = [];
  
  useEffect(() => {
    if (userId) {
      fetchPost(userId);
	 
    } else {
    //   fetchPosts();
    //   setPost({});
    }
  }, [userId]);

  let fetchPost = (userId) => {
	axios.get('https://nbc-recommendations.dev.aiphanttech.com/predict',
	{
		params: {
			userId: userId,
		}
	})
	.then(function (response) {
		const results = response.data.Recommendations;
		console.log(results)
		results.forEach(element => {
			axios.get('https://tentpole-api.dev.nbcuniversaltech.com/api/beijing-olympics-2022/short-form?', {
				headers: {
					"Content-Type": "application/json",
					"x-api-key": "25e2bca4c5c9fa2cf36334add3b1180c",
				},
				params:{
					guid:element,
				}
			}).then(result => {
				Recs.push(result.data.imageURL);
			  })
			  .catch(err => {
				if(err.response.status === 404){
					setPost({})
				}
			 });
			 if(Recs.length>0){
				setPost(Recs)
			 }
		});

		
		
	})
	
  };
  
  
  return (
	
	<div className="card text-center m-3">
		<h5 className="card-header">Recommendations</h5>
	
		{post.map(element => {
			return(<div>{element}</div>)
		})}
		<div className="card-body">
			{/* {[post]?.map(element =>{
				return(<div>{element}</div>)
			})} */}
			
			{/* Image Urls: {[post].map(element => {
				<div>Hello :{element}</div>
				// <img src={element} alt="Girl in a jacket" width="500" height="600"></img>
				// console.log(element)
			})} */}
		</div>
	</div>
);
}
