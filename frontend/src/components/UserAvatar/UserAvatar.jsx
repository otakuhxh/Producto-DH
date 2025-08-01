import React from 'react';

const UserAvatar = ({ user }) => {
    if (!user) return null;

    return (
        <div className="user-avatar">
            <div className="avatar-circle">
                {user.initials}
            </div>
            <span>{user.firstName} {user.lastName}</span>
        </div>
    );
};

export default UserAvatar;