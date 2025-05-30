import styles from "./Card.module.css";
import defaultAvatar from "../../assets/images/img.png"; // путь до запасного изображения

const Card = ({
  image,
  title,
  description,
  buttonText,
  buttonType,
  onClick,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card_image}>
        <img src={image ? image : defaultAvatar} alt="service" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <button type={buttonType} onClick={onClick} className={styles.button}>
        {buttonText}
      </button>
    </div>
  );
};

export default Card;
