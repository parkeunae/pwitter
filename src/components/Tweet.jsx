import React from "react";
import { dbService } from "fbase";

const Tweet = ({ tweetObj, isOwner }) => {
    const onDeleteClick = async () => {
        const ok = window.confirm('Are you sure want to delete this tweet?');
        if (ok) {
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
        }
    }

    return (
        <div key={tweetObj.id}>
            <h4>{tweetObj.text}</h4>
            {isOwner && (
            <>
                <button onClick={onDeleteClick}>Delete Tweet</button>
                <button>Edit Tweet</button>
            </>
            )}
        </div>
    );
};

export default Tweet;
