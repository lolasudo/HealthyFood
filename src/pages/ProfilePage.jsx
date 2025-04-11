import { Button } from '@mui/material';

const ProfilePage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Мой профиль</h1>
      <p>Email: user@example.com</p>
      <Button variant="contained" color="primary">
        Редактировать профиль
      </Button>
    </div>
  );
};

export default ProfilePage;