import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';

const Home = ({ userObj }) => {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        dbService.collection('tweets').onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(tweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();

        await dbService.collection("tweets").add({
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setTweet('');
    }

    const onChange = (event) => {
        const { target: { value } } = event;
        setTweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                    value={tweet}
                    onChange={onChange}
                />
                <input type="submit" value="Tweet"/>
            </form>
            <div>
                {tweets.map((doc) => (
                    <div key={doc.id}>
                        <h4>{doc.text}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Home;
