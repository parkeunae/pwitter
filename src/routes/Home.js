import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import Tweet from 'components/Tweet';

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

        return () => {
            setTweets([]);
        }
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
                    <Tweet
                        key={doc.id}
                        tweetObj={doc}
                        isOwner={doc.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    )
};

export default Home;
