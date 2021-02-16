import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService, dbService } from 'fbase';

const Profile = ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push('/');
    };

    const getMyTweets = async () => {
        const tweets = await dbService
            .collection('tweets')
            .where('creatorId', '==', userObj.uid)
            .orderBy('createdAt', 'desc')
            .get();
        console.log(tweets.docs.map((doc) => doc.data()));
    };

    useEffect(() => {
        getMyTweets();
    }, []);

    const onChange = (event) => {
        const {
            target: { value },
        } = event;

        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    onChange={onChange}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
};

export default Profile;
