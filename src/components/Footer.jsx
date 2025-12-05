import "../styles.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} EventBoard · All Rights Reserved</p>
    </footer>
  );
}

export default Footer;
