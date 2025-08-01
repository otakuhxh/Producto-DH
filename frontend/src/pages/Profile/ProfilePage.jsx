import React from 'react';
import UserAvatar from '../../components/UserAvatar/UserAvatar';

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = '/login';
        return null;
    }

    return (
        <div className="page">
            <h1>Mi Perfil</h1>
            <UserAvatar user={user} />
            <div className="profile-info">
                <p><strong>Nombre:</strong> {user.firstName}</p>
                <p><strong>Apellido:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

export default ProfilePage;