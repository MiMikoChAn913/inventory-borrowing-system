import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const statusLabel = {
  PENDING: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
  RETURNED: "คืนแล้ว",
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function Notice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div className={`notice notice--${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
      <span>{notice.message}</span>
      <button className="icon-button" onClick={onClose} aria-label="ปิดข้อความ">×</button>
    </div>
  );
}

function Login({ onLogin, busy }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="เกี่ยวกับระบบ">
        <div className="brand-mark" aria-hidden="true">B</div>
        <p className="eyebrow">CPE 334 · TEAM พวกพี่ชอบบิด</p>
        <h1>ทุกการยืม<br />ตรวจสอบได้</h1>
        <p className="auth-copy">
          BorrowBox ช่วยให้ผู้ยืมส่งคำขอ และผู้ดูแลคลังอนุมัติ ติดตาม และตรวจสอบจำนวนอุปกรณ์ได้จากที่เดียว
        </p>
        <div className="flow-line" aria-label="ขั้นตอนการใช้งาน">
          <span>เลือกอุปกรณ์</span><i>→</i><span>ส่งคำขอ</span><i>→</i><span>อนุมัติ</span><i>→</i><span>คืน</span>
        </div>
      </section>
      <section className="auth-panel">
        <div className="login-card">
          <p className="eyebrow">ยินดีต้อนรับ</p>
          <h2>เข้าสู่ระบบ</h2>
          <p className="muted">ใช้บัญชีทดสอบที่สร้างจากคำสั่ง seed ของทีม</p>
          <form onSubmit={submit} className="form-stack">
            <label>
              อีเมล
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                placeholder="name@example.com"
                required
              />
            </label>
            <label>
              รหัสผ่าน
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                minLength={8}
                required
              />
            </label>
            <button className="button button--primary button--wide" disabled={busy}>
              {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
            </button>
          </form>
          <p className="security-note">ข้อมูลบัญชีและ session ถูกตรวจสอบโดย backend ไม่ได้เลือกบทบาทจากหน้าเว็บ</p>
        </div>
      </section>
    </main>
  );
}

function ItemCard({ item, onBorrow }) {
  const available = item.availableQuantity > 0;
  return (
    <article className="item-card">
      <div className="item-card__top">
        <div className="item-glyph" aria-hidden="true">{item.name.slice(0, 1).toUpperCase()}</div>
        <span className={`availability ${available ? "availability--yes" : "availability--no"}`}>
          {available ? `ว่าง ${item.availableQuantity}` : "ไม่ว่าง"}
        </span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="item-card__footer">
        <span>ทั้งหมด {item.totalQuantity} ชิ้น</span>
        {onBorrow && (
          <button className="button button--small" onClick={() => onBorrow(item)} disabled={!available}>
            ขอยืม
          </button>
        )}
      </div>
    </article>
  );
}

function RequestRow({ request, role, onApprove, onReject, onReturn, busy }) {
  return (
    <article className="request-row">
      <div className="request-row__main">
        <div className="request-row__title">
          <h3>{request.item.name}</h3>
          <span className={`status status--${request.status.toLowerCase()}`}>{statusLabel[request.status]}</span>
        </div>
        <p>{request.purpose}</p>
        <div className="request-meta">
          <span>จำนวน {request.quantity}</span>
          <span>{formatDate(request.requestedAt)}</span>
          {role === "CUSTODIAN" && <span>ผู้ยืม: {request.borrower.displayName}</span>}
        </div>
        {request.rejectionReason && <p className="rejection">เหตุผล: {request.rejectionReason}</p>}
      </div>
      <div className="request-actions">
        {role === "CUSTODIAN" && request.status === "PENDING" && (
          <>
            <button className="button button--approve" disabled={busy} onClick={() => onApprove(request.id)}>อนุมัติ</button>
            <button className="button button--ghost-danger" disabled={busy} onClick={() => onReject(request)}>ปฏิเสธ</button>
          </>
        )}
        {role === "BORROWER" && request.status === "APPROVED" && (
          <button className="button button--secondary" disabled={busy} onClick={() => onReturn(request.id)}>แจ้งคืนอุปกรณ์</button>
        )}
      </div>
    </article>
  );
}

function BorrowDialog({ item, onClose, onSubmit, busy }) {
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState("");
  if (!item) return null;

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ itemId: item.id, quantity: Number(quantity), purpose });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="borrow-title">
        <button className="modal-close" onClick={onClose} aria-label="ปิด">×</button>
        <p className="eyebrow">คำขอยืมใหม่</p>
        <h2 id="borrow-title">{item.name}</h2>
        <p className="muted">มีให้ยืม {item.availableQuantity} จากทั้งหมด {item.totalQuantity} ชิ้น</p>
        <form onSubmit={submit} className="form-stack">
          <label>
            จำนวน
            <input type="number" min="1" max={item.availableQuantity} value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
          </label>
          <label>
            วัตถุประสงค์
            <textarea value={purpose} onChange={(event) => setPurpose(event.target.value)} minLength={3} maxLength={500} rows="4" placeholder="ระบุว่าจะนำอุปกรณ์ไปใช้อะไร" required />
          </label>
          <div className="modal-actions">
            <button type="button" className="button button--secondary" onClick={onClose}>ยกเลิก</button>
            <button className="button button--primary" disabled={busy}>{busy ? "กำลังส่ง…" : "ส่งคำขอ"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function AddItemForm({ onSubmit, busy }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(1);

  const submit = async (event) => {
    event.preventDefault();
    const success = await onSubmit({ name, description, totalQuantity: Number(totalQuantity) });
    if (success) {
      setName("");
      setDescription("");
      setTotalQuantity(1);
    }
  };

  return (
    <form className="add-item" onSubmit={submit}>
      <div>
        <p className="eyebrow">คลังอุปกรณ์</p>
        <h2>เพิ่มรายการใหม่</h2>
      </div>
      <label>ชื่ออุปกรณ์<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={120} required /></label>
      <label>รายละเอียด<input value={description} onChange={(event) => setDescription(event.target.value)} minLength={2} maxLength={500} required /></label>
      <label>จำนวน<input type="number" min="1" max="10000" value={totalQuantity} onChange={(event) => setTotalQuantity(event.target.value)} required /></label>
      <button className="button button--primary" disabled={busy}>เพิ่มอุปกรณ์</button>
    </form>
  );
}

function Dashboard({ user, onLogout, setNotice }) {
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(false);
  const [borrowItem, setBorrowItem] = useState(null);

  const load = useCallback(async () => {
    const [itemResult, requestResult] = await Promise.all([api.items(), api.requests()]);
    setItems(itemResult.items);
    setRequests(requestResult.requests);
  }, []);

  useEffect(() => {
    load().catch((error) => setNotice({ kind: "error", message: error.message }));
  }, [load, setNotice]);

  const run = async (action, successMessage) => {
    setBusy(true);
    try {
      await action();
      await load();
      setNotice({ kind: "success", message: successMessage });
      return true;
    } catch (error) {
      setNotice({ kind: "error", message: error.message });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const pendingCount = useMemo(() => requests.filter((request) => request.status === "PENDING").length, [requests]);
  const approvedCount = useMemo(() => requests.filter((request) => request.status === "APPROVED").length, [requests]);

  const reject = async (request) => {
    const reason = window.prompt(`เหตุผลที่ปฏิเสธคำขอ ${request.item.name}`);
    if (reason === null) return;
    await run(() => api.reject(request.id, reason), "ปฏิเสธคำขอแล้ว");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="BorrowBox หน้าหลัก"><span>B</span>BorrowBox</a>
        <div className="user-menu">
          <div className="user-avatar" aria-hidden="true">{user.displayName.slice(0, 1).toUpperCase()}</div>
          <div><strong>{user.displayName}</strong><small>{user.role === "BORROWER" ? "ผู้ยืม" : "ผู้ดูแลคลัง"}</small></div>
          <button className="button button--secondary button--small" onClick={onLogout}>ออกจากระบบ</button>
        </div>
      </header>

      <main id="top" className="dashboard">
        <section className="welcome">
          <div>
            <p className="eyebrow">ภาพรวมวันนี้</p>
            <h1>สวัสดี, {user.displayName}</h1>
            <p>{user.role === "BORROWER" ? "เลือกอุปกรณ์ที่ต้องการ แล้วติดตามสถานะคำขอได้ที่นี่" : "ตรวจสอบคำขอและดูจำนวนอุปกรณ์คงเหลือในคลัง"}</p>
          </div>
          <button className="button button--secondary" disabled={busy} onClick={() => run(load, "อัปเดตข้อมูลแล้ว")}>↻ อัปเดตข้อมูล</button>
        </section>

        <section className="stat-grid" aria-label="สถิติโดยสรุป">
          <article><span>อุปกรณ์พร้อมยืม</span><strong>{items.reduce((sum, item) => sum + item.availableQuantity, 0)}</strong><small>ชิ้นในระบบ</small></article>
          <article><span>คำขอรอตรวจสอบ</span><strong>{pendingCount}</strong><small>รายการ</small></article>
          <article><span>กำลังยืม</span><strong>{approvedCount}</strong><small>รายการ</small></article>
        </section>

        {user.role === "CUSTODIAN" && <AddItemForm busy={busy} onSubmit={(input) => run(() => api.createItem(input), "เพิ่มอุปกรณ์แล้ว")} />}

        <section className="section-block">
          <div className="section-heading">
            <div><p className="eyebrow">รายการล่าสุด</p><h2>{user.role === "BORROWER" ? "อุปกรณ์ในคลัง" : "สถานะคลัง"}</h2></div>
            <span className="count-pill">{items.length} รายการ</span>
          </div>
          <div className="item-grid">
            {items.map((item) => <ItemCard key={item.id} item={item} onBorrow={user.role === "BORROWER" ? setBorrowItem : null} />)}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div><p className="eyebrow">ประวัติและการอนุมัติ</p><h2>{user.role === "BORROWER" ? "คำขอของฉัน" : "คำขอยืมทั้งหมด"}</h2></div>
            <span className="count-pill">{requests.length} รายการ</span>
          </div>
          <div className="request-list">
            {requests.length === 0 ? <div className="empty-state"><span>□</span><h3>ยังไม่มีคำขอ</h3><p>คำขอใหม่จะแสดงในส่วนนี้</p></div> : requests.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                role={user.role}
                busy={busy}
                onApprove={(id) => run(() => api.approve(id), "อนุมัติคำขอแล้ว")}
                onReject={reject}
                onReturn={(id) => run(() => api.returnItem(id), "บันทึกการคืนอุปกรณ์แล้ว")}
              />
            ))}
          </div>
        </section>
      </main>
      <footer><span>BorrowBox · Inventory & Borrowing System</span><span>CPE 334 · 2026</span></footer>

      <BorrowDialog
        item={borrowItem}
        busy={busy}
        onClose={() => setBorrowItem(null)}
        onSubmit={async (input) => {
          const success = await run(() => api.createRequest(input), "ส่งคำขอยืมแล้ว");
          if (success) setBorrowItem(null);
        }}
      />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api.me()
      .then((result) => setUser(result.user))
      .catch((error) => {
        if (error.status !== 401) setNotice({ kind: "error", message: error.message });
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setBusy(true);
    try {
      const result = await api.login(email, password);
      setUser(result.user);
      setNotice({ kind: "success", message: "เข้าสู่ระบบสำเร็จ" });
    } catch (error) {
      setNotice({ kind: "error", message: error.message });
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await api.logout();
      setUser(null);
      setNotice({ kind: "success", message: "ออกจากระบบแล้ว" });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="brand-mark">B</div><p>กำลังเตรียมระบบ…</p></div>;

  return (
    <>
      <Notice notice={notice} onClose={() => setNotice(null)} />
      {user ? <Dashboard user={user} onLogout={logout} setNotice={setNotice} /> : <Login onLogin={login} busy={busy} />}
    </>
  );
}
