import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';

const Home = ({ userObj }) => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        const unsubscribe = dbService.collection('tweets')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                const tweetArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTweets(tweetArray);
            });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <TweetFactory userObj={userObj} />
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
