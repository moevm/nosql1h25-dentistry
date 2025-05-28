const FullNameFromUser = ({ user }) => {
  return (
    <span>
      {user.surname} {user.name} {user.patronymic}
    </span>
  );
};

export default FullNameFromUser