import conf from "../../config";

export default function Footer() {
  return (
    <footer>
      <img src="/assets/logo.png" alt="Logo" />

      <div className="links">
        {
          conf.SITE_SOCIAL &&
          <a href={conf.SITE_SOCIAL} target="_blank" className="fab fa-twitter"></a>
        }

        {
          conf.SITE_CREDITS &&
          <a href="https://webicco.studio" target="_blank">🎨 by Webicco</a>
        }
      </div>

      <p className="disclaimer">&copy; {conf.SITE_TITLE} 2025. We do not store any media.</p>
    </footer>
  )
}
