import styles from "./Card.module.css";

interface Props {
  title: string;
  body: string;
  href: string;
}

function Card({ title, body, href }: Props) {
  return (
    <li className={styles.linkCard}>
      <a href={href}>
        <h2>
          {title}
          <span>&rarr;</span>
        </h2>
        <p>{body}</p>
      </a>
    </li>
  );
}

export default Card;
