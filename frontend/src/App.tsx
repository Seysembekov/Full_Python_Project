import { useState } from 'react'
import './App.css'

type Action = 'payments' | 'transfers' | 'topup' | 'qr' | 'history'

const actions: { id: Action; label: string; icon: string; tone: string }[] = [
  { id: 'payments', label: 'Оплатить', icon: '↗', tone: 'blue' },
  { id: 'transfers', label: 'Перевести', icon: '⇄', tone: 'green' },
  { id: 'topup', label: 'Пополнить', icon: '+', tone: 'orange' },
  { id: 'qr', label: 'Сканировать QR', icon: '▦', tone: 'purple' },
]

function App() {
  const [activeTab, setActiveTab] = useState('Главная')
  const [modal, setModal] = useState<Action | null>(null)
  const [notice, setNotice] = useState('')

  const triggerAction = (id: Action) => setModal(id)
  const submitAction = () => {
    setNotice('Действие готово к подключению к API')
    setModal(null)
    window.setTimeout(() => setNotice(''), 3200)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark"><span>V</span><strong>vbank</strong></div>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {['Главная', 'Платежи', 'Переводы', 'Продукты'].map((tab) => (
            <button className={activeTab === tab ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>
          ))}
        </nav>
        <button className="profile-button" onClick={() => setNotice('Профиль — endpoint /api/profile')} aria-label="Открыть профиль"><span className="avatar">АК</span><span className="profile-name">Алексей К.</span><span className="chevron">⌄</span></button>
      </header>

      <main>
        <section className="hero-section">
          <div>
            <p className="eyebrow">СРЕДА, 01 ОКТЯБРЯ 2026</p>
            <h1>Добрый день, Алексей</h1>
            <p className="subtitle">Ваши финансы под контролем</p>
          </div>
          <button className="support-button" onClick={() => setNotice('Поддержка — endpoint /api/support')}><span>?</span> Помощь</button>
        </section>

        <section className="balance-card">
          <div className="card-glow"></div>
          <div className="balance-top"><span>ОБЩИЙ БАЛАНС</span><button onClick={() => setNotice('Баланс обновлён')} aria-label="Обновить баланс">⟳</button></div>
          <div className="balance-amount">1 284 560 <span>₸</span></div>
          <div className="balance-bottom"><span>+ 42 300 ₸ за этот месяц</span><button onClick={() => setNotice('Скрытие баланса — локальное UI действие')}>Скрыть баланс</button></div>
        </section>

        <section className="quick-actions">
          <div className="section-heading"><h2>Быстрые действия</h2><button onClick={() => setNotice('Все действия — endpoint /api/actions')}>Все действия <span>→</span></button></div>
          <div className="action-grid">{actions.map((action) => <button className="action-card" key={action.id} onClick={() => triggerAction(action.id)}><span className={`action-icon ${action.tone}`}>{action.icon}</span><span>{action.label}</span><small>API endpoint</small></button>)}</div>
        </section>

        <section className="content-grid">
          <div className="panel transactions-panel"><div className="panel-heading"><div><p className="eyebrow">ПОСЛЕДНИЕ ОПЕРАЦИИ</p><h2>История операций</h2></div><button className="text-button" onClick={() => setActiveTab('Платежи')}>Смотреть все <span>→</span></button></div>
            <div className="transaction-list">
              <Transaction icon="G" title="Glovo" meta="Сегодня, 14:32" amount="− 3 250 ₸" color="orange" />
              <Transaction icon="A" title="Зачисление зарплаты" meta="Сегодня, 09:00" amount="+ 420 000 ₸" color="green" positive />
              <Transaction icon="K" title="Kaspi Магазин" meta="Вчера, 18:45" amount="− 12 800 ₸" color="red" />
              <Transaction icon="M" title="Мобильная связь" meta="30 сентября, 11:20" amount="− 4 500 ₸" color="purple" />
            </div>
          </div>
          <div className="panel cards-panel"><div className="panel-heading"><div><p className="eyebrow">ВАШИ ПРОДУКТЫ</p><h2>Карты и счета</h2></div><button className="add-button" onClick={() => setNotice('Добавление карты — endpoint /api/cards')} aria-label="Добавить карту">+</button></div>
            <div className="bank-card"><div className="card-chip"></div><span className="card-type">vbank</span><strong>••••  4821</strong><div className="card-info"><span>VISA</span><span>12/28</span></div></div>
            <button className="outline-button" onClick={() => setNotice('Управление картой — endpoint /api/cards/4821')}>Управлять картой <span>→</span></button>
          </div>
        </section>
      </main>

      <nav className="mobile-nav" aria-label="Мобильная навигация">{['⌂', '↗', '⇄', '◉'].map((icon, index) => <button key={icon} className={index === 0 ? 'mobile-item active' : 'mobile-item'} onClick={() => setActiveTab(['Главная', 'Платежи', 'Переводы', 'Профиль'][index])}><span>{icon}</span><small>{['Главная', 'Платежи', 'Переводы', 'Профиль'][index]}</small></button>)}</nav>
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}>×</button><span className="modal-icon">{actions.find((item) => item.id === modal)?.icon}</span><p className="eyebrow">ДЕЙСТВИЕ</p><h2>{actions.find((item) => item.id === modal)?.label}</h2><p>Здесь будет форма, подключенная к вашему backend endpoint.</p><div className="endpoint">POST /api/{modal}</div><button className="primary-button" onClick={submitAction}>Продолжить <span>→</span></button></div></div>}
    </div>
  )
}

function Transaction({ icon, title, meta, amount, color, positive = false }: { icon: string; title: string; meta: string; amount: string; color: string; positive?: boolean }) {
  return <button className="transaction" onClick={() => undefined}><span className={`transaction-icon ${color}`}>{icon}</span><span className="transaction-copy"><strong>{title}</strong><small>{meta}</small></span><strong className={positive ? 'positive amount' : 'amount'}>{amount}</strong><span className="row-arrow">›</span></button>
}

export default App
     
