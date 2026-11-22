import { Link } from 'react-router-dom';
import styles from './Privacy.module.css';

function Privacy() {
  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <h1>Privacy Policy</h1>
        <p>
          Kasatria Periodic Table is a demo web app built for a job assignment. This page explains
          what happens to your information when you use it.
        </p>

        <h2>What we receive</h2>
        <p>
          When you sign in with Google, Google shares your name, email address and profile picture
          with this app. We never see your password.
        </p>

        <h2>How it is used</h2>
        <p>
          Your name and picture are only shown on the page so you can see who is signed in. They are
          kept in your browser&apos;s session storage and are removed when you log out or close the
          tab.
        </p>

        <h2>What we do not do</h2>
        <p>
          This app has no server or database of its own. Your information is not stored anywhere
          else, sold, or shared with anyone.
        </p>

        <h2>Data shown in the app</h2>
        <p>
          The people shown in the periodic table come from sample data in a Google Sheet provided
          for the assignment.
        </p>

        <Link to="/" className={styles.back}>
          ← Back to sign in
        </Link>
      </article>
    </main>
  );
}

export default Privacy;
