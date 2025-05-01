import Card from "./components/Card.tsx";
import githubSrc from "./images/github.svg";
import logoSrc from "./images/logoWDropShadow.svg";
import styles from "./App.module.css";

function App() {
  return (
    <main>
      <div className={styles.banner}>
        <nav className={styles.nav}>
          <a href="https://github.com/loambuild">
            <img src={githubSrc} alt="GitHub" />
          </a>
        </nav>

        <div className={styles.container}>
          <h1 className={styles.h1}>
            <img src={logoSrc} alt="LOAM" />
          </h1>
          <h2 className={styles.h2}>Hello Loam</h2>
          <div className={styles.intro}>
            <div className={styles.instructions}>
              <p>
                This project includes two Loam contracts: <code>Core</code> and{" "}
                <code>StatusMessage</code>, located in the{" "}
                <code>contracts/</code> directory.
              </p>

              <p>
                When you ran <code>npm run dev</code>, Loam bound these
                contracts to TypeScript clients in the{" "}
                <code>src/contracts/</code> directory.
              </p>
            </div>
            <ul role="list" className={styles.linkCardGrid}>
              <Card
                href="https://docs.astro.build/"
                title="Astro Docs"
                body="Learn how Astro works and explore the official API docs."
              />
              <Card
                href="https://loam.build/"
                title="Loam Homepage"
                body="Learn about Loam."
              />
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
