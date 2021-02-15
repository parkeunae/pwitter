import React, { useState } from "react";
import { dbService } from "fbase";

const Tweet = ({ tweetObj, isOwner }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm('Are you sure want to delete this tweet?');
        if (ok) {
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
        }
    }

    const toggleEditing = () => setIsEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();

        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text: newTweet,
        });

        setIsEditing(false);
    }

    const onChange = (event) => {
        const { target: { value } } = event;
        setNewTweet(value);
    }

    return (
        <div  key={tweetObj.id}>
            {isEditing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your tweet"
                            value={newTweet}
                            onChange={onChange}
                            required
                        />
                        <input type="submit" value="Update Tweet"/>
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{tweetObj.text}</h4>
                    {tweetObj.attachmentUrl && (
                        <img
                            src={tweetObj.attachmentUrl}
                            width="50px"
                            height="50px"
                            alt=""
                        />
                    )}
                    {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Delete Tweet</button>
                        <button onClick={toggleEditing}>Edit Tweet</button>
                    </>
                    )}
                </>
            )}
        </div>
    );
};

export default Tweet;
