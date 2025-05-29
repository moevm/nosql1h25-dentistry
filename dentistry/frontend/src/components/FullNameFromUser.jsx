const FullNameFromUser = ({ user }) => {
  return (
    <span>
      {user.last_name} {user.first_name} {user.second_name}
    </span>
  );
};

export default FullNameFromUser