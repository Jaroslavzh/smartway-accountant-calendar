export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="https://smartway.today/" target="_blank" rel="noreferrer" aria-label="Smartway">
        <img src={`${import.meta.env.BASE_URL}assets/smartway-logo.svg`} alt="Smartway" />
        <span>Станция управления<br />командировками</span>
      </a>
      <nav className="main-nav" aria-label="Основная навигация">
        <a href="https://smartway.today/" target="_blank" rel="noreferrer">Для кого</a>
        <a href="https://smartway.today/" target="_blank" rel="noreferrer">Возможности</a>
        <a href="https://smartway.today/" target="_blank" rel="noreferrer">Полезное</a>
        <a href="https://smartway.today/" target="_blank" rel="noreferrer">MICE</a>
        <a href="https://smartway.today/" target="_blank" rel="noreferrer">Тарифы</a>
      </nav>
      <div className="header-actions">
        <a className="round-link" href="mailto:hello@smartway.today" aria-label="Написать"><img src={`${import.meta.env.BASE_URL}assets/mail.svg`} alt="" /></a>
        <a className="round-link" href="tel:+74951091999" aria-label="Позвонить"><img src={`${import.meta.env.BASE_URL}assets/phone.svg`} alt="" /></a>
        <a className="login-link" href="https://app.smartway.today/" target="_blank" rel="noreferrer">Войти</a>
        <a className="register-button" href="https://smartway.today/" target="_blank" rel="noreferrer">Протестировать</a>
      </div>
    </header>
  )
}
