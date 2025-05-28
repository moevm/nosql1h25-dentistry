import Card from "./Card";

const RecordCard = ({
  image,
  service_name,
  fullname,
  iso_date,
  onClick,
  disabled,
}) => {
  const date_string = new Date(iso_date).toLocaleDateString();

  return (
    <Card
      image={image}
      title={service_name}
      description={fullname}
      buttonText={date_string}
      buttonType="submit"
      onClick={onClick}
      disabled={disabled}
    />
  );
};

export default RecordCard;
